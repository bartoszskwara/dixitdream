package com.dixitdream.backend.dao.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String name;

    @ManyToMany(mappedBy = "tags")
    Set<Painting> paintings = new HashSet<>();

    @ManyToMany(mappedBy = "tags")
    Set<Challenge> challenges = new HashSet<>();
}
