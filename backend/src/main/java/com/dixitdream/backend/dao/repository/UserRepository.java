package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.projection.UserInfoDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface UserRepository extends CrudRepository<UserProfile, Long> {

    @Query("select p from UserProfile p where p.email = :email or p.username = :username")
    UserProfile findByEmailOrUsername(@Param("email") String email, @Param("username") String username);

    Optional<UserProfile> findByEmail(String email);

    Set<UserProfile> findAll();

    @Query("select new com.dixitdream.backend.dao.projection.UserInfoDto(p.id, p.username, size(p.followers), size(p.following), size(p.paintings)) " +
            "from UserProfile p " +
            "where p.id = :id")
    Optional<UserInfoDto> findUserById(@Param("id") Long id);
}