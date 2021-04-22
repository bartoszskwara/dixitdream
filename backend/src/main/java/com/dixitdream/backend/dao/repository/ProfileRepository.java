package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.projection.ProfileInfoDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface ProfileRepository extends CrudRepository<Profile, Long> {

    @Query("select p from Profile p where p.email = :email or p.username = :username")
    Profile findByEmailOrUsername(@Param("email") String email, @Param("username") String username);

    Set<Profile> findAll();

    @Query("select new com.dixitdream.backend.dao.projection.ProfileInfoDto(p.id, p.username, size(p.followers), size(p.following), size(p.paintings)) " +
            "from Profile p " +
            "where p.id = :id")
    ProfileInfoDto findProfileById(@Param("id") Long id);
}