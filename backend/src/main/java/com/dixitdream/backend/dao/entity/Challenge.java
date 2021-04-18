package com.dixitdream.backend.dao.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Entity
public class Challenge {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @NotNull
    private String name;
    @NotNull
    private LocalDateTime startDate;
    @NotNull
    private LocalDateTime endDate;
    private boolean active;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "challenge_tag",
            joinColumns = @JoinColumn(name = "challenge_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    Set<Tag> tags;

    @OneToMany(mappedBy="challenge")
    Set<Painting> paintings;
}
