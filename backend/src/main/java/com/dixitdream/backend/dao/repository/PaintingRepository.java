package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Painting;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface PaintingRepository extends CrudRepository<Painting, Long>, CustomPaintingRepository {

    Set<Painting> findAll();

    @Query(value = "select p from Painting p " +
            "left join fetch p.likes l " +
            "left join fetch p.visits v " +
            "left join fetch p.challenge ch " +
            "where p.id = :paintingId")
    Optional<Painting> findByIdWithDetails(@Param("paintingId") Long paintingId);
}