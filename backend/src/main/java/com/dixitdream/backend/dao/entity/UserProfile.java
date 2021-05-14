package com.dixitdream.backend.dao.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    @NotNull
    private String username;
    @NotNull
    private String email;
    private String password;
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "followers",
            joinColumns={@JoinColumn(name="user_id", referencedColumnName="id")},
            inverseJoinColumns={@JoinColumn(name="follower_id", referencedColumnName="id")}
    )
    private Set<UserProfile> followers = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "followers", cascade = CascadeType.PERSIST)
    private Set<UserProfile> following = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private Set<Painting> paintings = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "likes", cascade = CascadeType.PERSIST)
    private Set<Painting> likedPaintings = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "visits", cascade = CascadeType.PERSIST)
    private Set<Painting> visitedPaintings = new HashSet<>();
}
