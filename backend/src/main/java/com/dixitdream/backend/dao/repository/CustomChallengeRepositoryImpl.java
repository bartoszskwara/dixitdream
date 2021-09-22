package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Tag;
import lombok.RequiredArgsConstructor;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RequiredArgsConstructor
public class CustomChallengeRepositoryImpl implements CustomChallengeRepository {

    private final EntityManager em;

    @Override
    public List<Challenge> findChallenges(String query, Collection<String> tags, Long lastChallengeId, int limit) {

        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<Challenge> criteriaQuery = builder.createQuery(Challenge.class);
        Root<Challenge> root = criteriaQuery.from(Challenge.class);

        List<Predicate> predicates = new ArrayList<>();
        if(lastChallengeId != null) {
            predicates.add(builder.lessThan(root.get("id"), lastChallengeId));
        }

        if(isNotEmpty(query)) {
            String likeQuery = format("%%%s%%", query).toLowerCase();
            predicates.add(builder.like(builder.lower(root.get("name")), likeQuery));
        }

        if(isNotEmpty(tags)) {
            List<String> lowerTags = tags.stream().map(String::toLowerCase).collect(Collectors.toList());
            Subquery<Challenge> subQuery = criteriaQuery.subquery(Challenge.class);
            Root<Challenge> subRoot = subQuery.from(Challenge.class);
            Join<Challenge, Tag> tagsJoin = subRoot.join("tags");
            subQuery.select(subRoot.get("id"))
                    .where(builder.lower(tagsJoin.get("name")).in(lowerTags))
                    .groupBy(subRoot.get("id"))
                    .having(builder.equal(builder.count(subRoot.get("id")), tags.size()));
            predicates.add(builder.and(builder.in(root.get("id")).value(subQuery)));
        }

        root.fetch("tags");
        root.fetch("paintings", JoinType.LEFT);
        criteriaQuery
                .distinct(true)
                .select(root);
        if(isNotEmpty(predicates)) {
            criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        }
        criteriaQuery.orderBy(builder.desc(root.get("active")), builder.desc(root.get("id")));
        return em.createQuery(criteriaQuery).setMaxResults(limit).getResultList();
    }
}