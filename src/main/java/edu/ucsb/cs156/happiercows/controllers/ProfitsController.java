package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.entities.Profit;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.models.CurrentUser;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;
import java.time.LocalDateTime;

// Code is mostly lifted from TodosController in demo-spring-react-example-v2

@Api(description = "CRUD Operations for Profits")
@RequestMapping("/api/profits")
@RestController
@Slf4j
public class ProfitsController extends ApiController {

    @Autowired
    ProfitRepository profitRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @Autowired
    CommonsRepository commonsRepository;

    @ApiOperation(value = "Get a specific profit for current user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Profit getProfitById(
            @ApiParam("id") @RequestParam Long id) {
        
        User u = getCurrentUser().getUser();
        Long userId = u.getId();
        Profit profit = profitRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        // Throw error in case of invalid access (User ID mismatch)
        if (userId != profit.getUserCommons().getUserId())
            throw new EntityNotFoundException(Profit.class, id);

        return profit;
    }

    @ApiOperation(value = "Get a specific profit by ID (admin only))")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public Profit getProfitByIdAdmin(
            @ApiParam("id") @RequestParam Long id) {

        Profit profit = profitRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        return profit;
    }

    @ApiOperation(value = "Get all profits for current user's commons")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all/commons")
    public Iterable<Profit> getProfitsByUserCommonsId(
            @ApiParam("userCommonsId") @RequestParam Long userCommonsId) {
        
        User u = getCurrentUser().getUser();
        Long userId = u.getId();
        
        // Throw error in case UserCommons does not exist
        UserCommons userCommons = userCommonsRepository.findById(userCommonsId)
            .orElseThrow(() -> new EntityNotFoundException(UserCommons.class, userCommonsId));

        // Throw error in case of invalid access (UserCommons does not belong to current User)
        if (userId != userCommons.getUserId())
            throw new EntityNotFoundException(UserCommons.class, userCommonsId);

        Iterable<Profit> profits = profitRepository.findAllByUserCommonsId(userCommonsId);

        return profits;
    }

    @ApiOperation(value = "Get all profits for a specific UserCommons by ID (admin only)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all/commons")
    public Iterable<Profit> getProfitsByUserCommonsIdAdmin(
            @ApiParam("userCommonsId") @RequestParam Long userCommonsId) {

        // Throw error in case UserCommons does not exist
        UserCommons userCommons = userCommonsRepository.findById(userCommonsId)
            .orElseThrow(() -> new EntityNotFoundException(UserCommons.class, userCommonsId));
        
        Iterable<Profit> profits = profitRepository.findAllByUserCommonsId(userCommonsId);

        return profits;
    }


    @ApiOperation(value = "Create a new profit for a commons belonging to the current user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public Profit createProfit(
            @ApiParam("profit") @RequestParam long profit,
            @ApiParam("date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("localDateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime localDateTime,
            @ApiParam("userCommonsId") @RequestParam long userCommonsId) {
        
        User u = getCurrentUser().getUser();
        Long userId = u.getId();

        // Throw error in case UserCommons does not exist
        UserCommons userCommons = userCommonsRepository.findById(userCommonsId)
            .orElseThrow(() -> new EntityNotFoundException(UserCommons.class, userCommonsId));

        // Throw error in case UserCommons does not belong to current user
        if (userId != userCommons.getUserId())
            throw new EntityNotFoundException(UserCommons.class, userCommonsId);

        Profit p = new Profit();
        p.setUserCommons(userCommons);
        p.setProfit(profit);
        p.setTime(localDateTime);
        Profit newProfit = profitRepository.save(p);
        return newProfit;
    }

    @ApiOperation(value = "Create a new profit for a specific UserCommons by ID (admin only))")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/admin/post")
    public Profit createProfitAdmin(
            @ApiParam("profit") @RequestParam long profit,
            @ApiParam("date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("localDateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime localDateTime,
            @ApiParam("userCommonsId") @RequestParam long userCommonsId) {
        
        // Throw error in case UserCommons does not exist
        UserCommons userCommons = userCommonsRepository.findById(userCommonsId)
            .orElseThrow(() -> new EntityNotFoundException(UserCommons.class, userCommonsId));

        Profit p = new Profit();
        p.setUserCommons(userCommons);
        p.setProfit(profit);
        p.setTime(localDateTime);
        Profit newProfit = profitRepository.save(p);
        return newProfit;
    }

    @ApiOperation(value = "Delete a profit belonging to the current user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("")
    public Object deleteProfit(
            @ApiParam("id") @RequestParam Long id) {
        
        User u = getCurrentUser().getUser();
        Long userId = u.getId();

        Profit profit = profitRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        // Throw error in case profit does not belong to user
        if (userId != profit.getUserCommons().getUserId())
            throw new EntityNotFoundException(Profit.class, id);

        profitRepository.delete(profit);
        return genericMessage("Profit with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Delete a specific profit by ID (admin only)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin")
    public Object deleteProfitAdmin(
            @ApiParam("id") @RequestParam Long id) {
        
        Profit profit = profitRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        profitRepository.delete(profit);
        return genericMessage("Profit with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a specific profit for current user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("")
    public Profit updateProfitById(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Profit incomingProfit) {
        
        User u = getCurrentUser().getUser();
        Long userId = u.getId();

        Profit profit = profitRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        // Throw error in case profit does not belong to current user
        if (userId != profit.getUserCommons().getUserId())
            throw new EntityNotFoundException(Profit.class, id);

        profit.setProfit(incomingProfit.getProfit());
        profit.setTime(incomingProfit.getTime());

        profitRepository.save(profit);

        return profit;
    }

    @ApiOperation(value = "Update a single profit by ID (admin only, can't change ownership)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin")
    public Profit updateProfitByIdAdmin(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid Profit incomingProfit) {
        
        Profit profit = profitRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(Profit.class, id));

        profit.setProfit(incomingProfit.getProfit());
        profit.setTime(incomingProfit.getTime());

        profitRepository.save(profit);

        return profit;
    }
}