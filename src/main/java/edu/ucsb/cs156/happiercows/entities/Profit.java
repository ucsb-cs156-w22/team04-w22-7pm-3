package edu.ucsb.cs156.happiercows.entities;

import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "profit")
public class Profit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @ManyToOne
  @JoinColumn(name = "user_commons_id")
  // Allows multiple profit entries in the table to be associated with a single user_commons_id

  private UserCommons userCommons;
  private long profit;
  private LocalDateTime time;
}