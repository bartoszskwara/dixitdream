package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Profile;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface ProfileRepository extends CrudRepository<Profile, Long> {

    @Query("select p from Profile p where p.email = :email or p.username = :username")
    Profile findByEmailOrUsername(@Param("email") String email, @Param("username") String username);

    Set<Profile> findAll();
}