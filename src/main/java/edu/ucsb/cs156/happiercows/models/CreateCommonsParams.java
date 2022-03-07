package edu.ucsb.cs156.happiercows.models;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.AccessLevel;

import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;


import org.springframework.security.core.GrantedAuthority;

import edu.ucsb.cs156.happiercows.entities.User;

import java.util.Collection;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class CreateCommonsParams {
  private String name;
  private double cowPrice;
  private double milkPrice;
  private double startingBalance;
  @DateTimeFormat
  private Date startDate;
  @DateTimeFormat
  private Date endDate;
}
