package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.entity.Tag;
import lombok.RequiredArgsConstructor;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
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
    public List<Painting> findPaintings(String query, Collection<String> tags, Long challengeId, Long profileId, Long lastPaintingId, int limit) {

        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Painting> criteriaQuery = builder.createQuery(Painting.class);
        Root<Painting> root = criteriaQuery.from(Painting.class);

        List<Predicate> predicates = new ArrayList<>();
        if(lastPaintingId != null) {
            predicates.add(builder.lessThan(root.get("id"), lastPaintingId));
        }

        if(challengeId != null) {
            Join<Painting, Challenge> challengeJoin = root.join("challenge");
            predicates.add(builder.equal(challengeJoin.get("id"), challengeId));
        }

        if(profileId != null) {
            Join<Painting, Profile> profileJoin = root.join("profile");
            predicates.add(builder.equal(profileJoin.get("id"), profileId));
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

        Query limitedCriteriaQuery = em.createQuery(
                criteriaQuery
                        .select(root)
                        .distinct(true)
                        .where(builder.and(predicates.toArray(new Predicate[0])))
                        .orderBy(asList(builder.desc(root.get("id")))))
                .setMaxResults(limit);
        return limitedCriteriaQuery.getResultList();
    }
}