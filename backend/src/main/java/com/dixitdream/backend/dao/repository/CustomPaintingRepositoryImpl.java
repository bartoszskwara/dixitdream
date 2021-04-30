package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dao.projection.PaintingProjectionDto;
import lombok.RequiredArgsConstructor;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Selection;
import javax.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.Arrays.asList;
import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RequiredArgsConstructor
public class CustomPaintingRepositoryImpl implements CustomPaintingRepository {

    private final EntityManager em;

    @Override
    public List<PaintingProjectionDto> findPaintings(String query, Collection<String> tags, Long challengeId, Long userId, Long lastPaintingId, int limit, UserProfile currentUser) {

        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<PaintingProjectionDto> criteriaQuery = builder.createQuery(PaintingProjectionDto.class);
        Root<Painting> root = criteriaQuery.from(Painting.class);

        List<Predicate> predicates = new ArrayList<>();
        if(lastPaintingId != null) {
            predicates.add(builder.lessThan(root.get("id"), lastPaintingId));
        }

        if(challengeId != null) {
            Join<Painting, Challenge> challengeJoin = root.join("challenge");
            predicates.add(builder.equal(challengeJoin.get("id"), challengeId));
        }

        if(userId != null) {
            Join<Painting, UserProfile> userJoin = root.join("user");
            predicates.add(builder.equal(userJoin.get("id"), userId));
        }

        if(isNotEmpty(query)) {
            String likeQuery = format("%%%s%%", query).toLowerCase();
            Join<Painting, Tag> tagsJoin = root.join("tags");
            predicates.add(builder.or(
                    builder.like(builder.lower(root.get("title")), likeQuery),
                    builder.like(builder.lower(root.get("description")), likeQuery),
                    builder.like(builder.lower(tagsJoin.get("name")), likeQuery)));
        }

        if(isNotEmpty(tags)) {
            List<String> lowerTags = tags.stream().map(String::toLowerCase).collect(Collectors.toList());
            Subquery<Painting> subQuery = criteriaQuery.subquery(Painting.class);
            Root<Painting> subRoot = subQuery.from(Painting.class);
            Join<Painting, Tag> tagsJoin = subRoot.join("tags");
            subQuery.select(subRoot.get("id"))
                    .where(builder.lower(tagsJoin.get("name")).in(lowerTags))
                    .groupBy(subRoot.get("id"))
                    .having(builder.equal(builder.count(subRoot.get("id")), tags.size()));
            predicates.add(builder.and(builder.in(root.get("id")).value(subQuery)));
        }

        criteriaQuery
                .distinct(true)
                .multiselect(
                        root.get("id"),
                        root.get("filePath"),
                        root.get("user").get("id"),
                        builder.size(root.get("visits")),
                        builder.size(root.get("likes")),
                        isLikedByCurrentUser(criteriaQuery, builder, root, currentUser.getId())
                );
        if(isNotEmpty(predicates)) {
            criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        }
        criteriaQuery.orderBy(asList(builder.desc(root.get("id"))));
        return em.createQuery(criteriaQuery).setMaxResults(limit).getResultList();
    }

    private Selection isLikedByCurrentUser(CriteriaQuery<PaintingProjectionDto> criteriaQuery, CriteriaBuilder builder, Root<Painting> root, Long currentUserId) {
        Subquery<Long> likesSubQuery = criteriaQuery.subquery(Long.class);
        Root<Painting> likesSubRoot = likesSubQuery.from(Painting.class);
        Join<Painting, UserProfile> likesJoin = likesSubRoot.join("likes");
        likesSubQuery.select(builder.count(likesSubRoot.get("id")))
                .where(builder.and(
                        builder.equal(likesJoin.get("id"), currentUserId),
                        builder.equal(likesSubRoot.get("id"), root.get("id"))));

        return builder.selectCase()
                .when(builder.gt(likesSubQuery.getSelection(), 0), true)
                .otherwise(false);
    }
}