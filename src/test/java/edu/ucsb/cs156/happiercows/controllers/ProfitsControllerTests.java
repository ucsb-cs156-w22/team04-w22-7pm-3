package edu.ucsb.cs156.happiercows.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.controllers.ProfitsController;
import edu.ucsb.cs156.happiercows.entities.Profit;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;
import java.util.Map;

@WebMvcTest(controllers = ProfitsController.class)
@Import(TestConfig.class)
public class ProfitsControllerTests extends ControllerTestCase {

    @MockBean
    UserCommonsRepository userCommonsRepository;

    @MockBean
    UserRepository userRepository;

    @MockBean
    CommonsRepository commonsRepository;

    @MockBean
    ProfitRepository profitRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Tests for get operations

    @WithMockUser(roles = { "USER" })
    @Test
    public void get_profit_by_id_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(1).build();
        Profit expectedProfit = Profit.builder().id(7L).profit(100).time("03-17-1973").userCommons(expectedUserCommons).build();
        when(profitRepository.findById(7L)).thenReturn(Optional.of(expectedProfit));

        MvcResult response = mockMvc.perform(get("/api/profits?id=7"))
            .andExpect(status().isOk()).andReturn();

        verify(profitRepository, times(1)).findById(7L);

        String responseString = response.getResponse().getContentAsString();
        Profit actualProfit = objectMapper.readValue(responseString, Profit.class);
        assertEquals(actualProfit, expectedProfit);
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void get_profit_by_id_admin_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(10).build();
        Profit expectedProfit = Profit.builder().id(7L).profit(100).time("03-17-1973").userCommons(expectedUserCommons).build();
        when(profitRepository.findById(7L)).thenReturn(Optional.of(expectedProfit));
      
        MvcResult response = mockMvc.perform(get("/api/profits/admin?id=7"))
            .andExpect(status().isOk()).andReturn();
    
        verify(profitRepository, times(1)).findById(7L);

        String responseString = response.getResponse().getContentAsString();
        Profit actualProfit = objectMapper.readValue(responseString, Profit.class);
        assertEquals(actualProfit, expectedProfit);
    }


    @WithMockUser(roles = { "USER" })
    @Test
    public void get_profit_by_id_invalid_user_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(10).build();
        Profit expectedProfit = Profit.builder().id(7L).profit(100).time("03-17-1973").userCommons(expectedUserCommons).build();
        when(profitRepository.findById(7L)).thenReturn(Optional.of(expectedProfit));
      
        MvcResult response = mockMvc.perform(get("/api/profits?id=7"))
            .andExpect(status().isNotFound()).andReturn();
    
        verify(profitRepository, times(1)).findById(7L);
    
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("Profit with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void get_profit_by_id_nonexistent_test() throws Exception {
        MvcResult response = mockMvc.perform(get("/api/profits?id=7"))
            .andExpect(status().isNotFound()).andReturn();
    
        verify(profitRepository, times(1)).findById(7L);
    
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("Profit with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void get_profit_by_id_nonexistent_admin_test() throws Exception {
        MvcResult response = mockMvc.perform(get("/api/profits/admin?id=7"))
            .andExpect(status().isNotFound()).andReturn();
    
        verify(profitRepository, times(1)).findById(7L);
    
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("Profit with id 7 not found", json.get("message"));
    }

    // Tests for get all operations



    // Tests for create operations

    // Tests for delete operations

    // Tests for update operations
}