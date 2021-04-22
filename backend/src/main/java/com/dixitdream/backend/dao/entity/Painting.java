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
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
public class Painting {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;
    @NotNull
    private String title;
    private String description;
    @NotNull
    private String filePath;
    @NotNull
    private Timestamp creationDate;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
            name = "painting_tag",
            joinColumns = @JoinColumn(name = "painting_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    Set<Tag> tags = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id")
    Challenge challenge;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "likes",
            joinColumns={@JoinColumn(name="painting_id", referencedColumnName="id")},
            inverseJoinColumns={@JoinColumn(name="profile_id", referencedColumnName="id")}
    )
    private Set<Profile> likes = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "visits",
            joinColumns={@JoinColumn(name="painting_id", referencedColumnName="id")},
            inverseJoinColumns={@JoinColumn(name="profile_id", referencedColumnName="id")}
    )
    private Set<Profile> visits = new HashSet<>();

    public void addTags(Set<Tag> tags) {
        this.tags.addAll(tags);
        tags.forEach(t -> t.getPaintings().add(this));
    }

    public void addLike(Profile profile) {
        likes.add(profile);
        likes.forEach(p -> p.getLikedPaintings().add(this));
    }

    public void removeLike(Profile profile) {
        likes.remove(profile);
        likes.forEach(p -> p.getLikedPaintings().remove(this));
    }

    public void addVisit(Profile profile) {
        visits.add(profile);
        visits.forEach(p -> p.getVisitedPaintings().add(this));
    }
}
