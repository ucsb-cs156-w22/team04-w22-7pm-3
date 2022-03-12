package edu.ucsb.cs156.happiercows.entities;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Builder;
import lombok.AccessLevel;


import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "user_commons")
public class UserCommons {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;  

  @Column(name="commons_id")
  private long commonsId;  

  @Column(name="user_id")
  private long userId;  

  private int totalWealth;
<<<<<<< HEAD
  private double avgCowHealth;
=======
  private int numOfCows;
>>>>>>> 9a4d663 (Updated frontend to display totalPlayer, numCows, totalWealth, start&end date)

}

