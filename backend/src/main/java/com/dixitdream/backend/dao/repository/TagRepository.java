package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dao.projection.TagCountDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface TagRepository extends CrudRepository<Tag, Long> {

    @Query("select t from Tag t where t.name in (:names)")
    Set<Tag> findAllByNames(Set<String> names);

    @Query(value = "select t.name as tagName, count(*) as tagsCount from painting_tag pt " +
            "inner join tag t on pt.tag_id = t.id " +
            "where lower(t.name) like concat('%', lower(:query), '%') " +
            "group by t.name " +
            "having count(*) <= :lastCount " +
            "and (count(*) < :lastCount or lower(t.name) > :lastName) " +
            "order by count(*) desc, lower(t.name) " +
            "limit :limit", nativeQuery = true)
    List<TagCountDto> findMoreByQuery(@Param("query") String query, @Param("limit") int limit, @Param("lastCount") long lastCount, @Param("lastName") String lastName);

    @Query(value = "select t.name as tagName, count(*) as tagsCount from painting_tag pt " +
            "inner join tag t on pt.tag_id = t.id " +
            "where lower(t.name) like concat('%', lower(:query), '%') " +
            "group by t.name " +
            "order by count(*) desc, lower(t.name) " +
            "limit :limit", nativeQuery = true)
    List<TagCountDto> findByQuery(@Param("query") String query, @Param("limit") int limit);

}