package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Painting;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface PaintingRepository extends CrudRepository<Painting, Long>, CustomPaintingRepository {

    Set<Painting> findAll();

    @Query(value = "select * from painting p " +
            "where p.id > :lastId " +
            "and ( " +
            "   (:query != '' and lower(concat(p.title, p.description)) like lower(concat('%', :query, '%'))) " +
            "   or p.id in ( " +
            "       select painting_id from painting_tag pt " +
            "       inner join tag t on t.id = pt.tag_id " +
            "       where (lower(t.name) in (:tags)) " +
            "       or (:query != '' and lower(t.name) like lower(concat('%', :query, '%'))) " +
            "   ) " +
            ") " +
            "order by p.creation_date " +
            "limit :limit", nativeQuery = true)
    List<Painting> findByQueryAndTags(@Param("query") String query, @Param("limit") int limit, @Param("lastId") Long lastId, @Param("tags") Collection<String> tags);

    @Query(value = "select * from painting p " +
            "where p.id > :lastId " +
            "and p.challenge_id = :challengeId " +
            "order by p.creation_date " +
            "limit :limit", nativeQuery = true)
    List<Painting> findByChallengeId(@Param("challengeId") Long challengeId, @Param("limit") int limit, @Param("lastId") Long lastId);
}