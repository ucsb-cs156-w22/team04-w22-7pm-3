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
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;
import java.util.Map;
import java.util.List;

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
        Profit expectedProfit = Profit.builder().id(7L).profit(100).time("03171973").userCommons(expectedUserCommons).build();
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
        Profit expectedProfit = Profit.builder().id(7L).profit(100).time("03171973").userCommons(expectedUserCommons).build();
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
        Profit expectedProfit = Profit.builder().id(7L).profit(100).time("03171973").userCommons(expectedUserCommons).build();
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
    @WithMockUser(roles = { "USER" })
    @Test
    public void get_all_profits_by_usercommons_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(1).build();
        Profit profit1 = Profit.builder().id(7L).profit(100).time("03171973").userCommons(expectedUserCommons).build();
        Profit profit2 = Profit.builder().id(8L).profit(150).time("03181973").userCommons(expectedUserCommons).build();
        
        List<Profit> expectedProfits = new ArrayList<Profit>();
        expectedProfits.add(profit1);
        expectedProfits.add(profit2);
        when(profitRepository.findAllByUserCommonsId(3L)).thenReturn(expectedProfits);
        when(userCommonsRepository.findById(3L)).thenReturn(Optional.of(expectedUserCommons));

        MvcResult response = mockMvc.perform(get("/api/profits/all/commons?userCommonsId=3"))
            .andExpect(status().isOk()).andReturn();

        verify(profitRepository, times(1)).findAllByUserCommonsId(3L);

        String responseString = response.getResponse().getContentAsString();
        List<Profit> actualProfits = objectMapper.readValue(responseString, new TypeReference<List<Profit>>() {
        });
        assertEquals(actualProfits, expectedProfits);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void get_all_profits_by_usercommons_invalid_user_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(10).build();
        Profit profit1 = Profit.builder().id(7L).profit(100).time("03171973").userCommons(expectedUserCommons).build();
        Profit profit2 = Profit.builder().id(8L).profit(150).time("03181973").userCommons(expectedUserCommons).build();
        
        List<Profit> expectedProfits = new ArrayList<Profit>();
        expectedProfits.add(profit1);
        expectedProfits.add(profit2);
        when(profitRepository.findAllByUserCommonsId(3L)).thenReturn(expectedProfits);
        when(userCommonsRepository.findById(3L)).thenReturn(Optional.of(expectedUserCommons));

        MvcResult response = mockMvc.perform(get("/api/profits/all/commons?userCommonsId=3"))
            .andExpect(status().isNotFound()).andReturn();

        verify(userCommonsRepository, times(1)).findById(3L);
        
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UserCommons with id 3 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void get_all_profits_by_usercommons_nonexistent_test() throws Exception {
        MvcResult response = mockMvc.perform(get("/api/profits/all/commons?userCommonsId=3"))
            .andExpect(status().isNotFound()).andReturn();

        verify(userCommonsRepository, times(1)).findById(3L);

        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UserCommons with id 3 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void get_all_profits_by_usercommons_admin_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(10).build();
        Profit profit1 = Profit.builder().id(7L).profit(100).time("03171973").userCommons(expectedUserCommons).build();
        Profit profit2 = Profit.builder().id(8L).profit(150).time("03181973").userCommons(expectedUserCommons).build();
        
        List<Profit> expectedProfits = new ArrayList<Profit>();
        expectedProfits.add(profit1);
        expectedProfits.add(profit2);
        when(profitRepository.findAllByUserCommonsId(3L)).thenReturn(expectedProfits);
        when(userCommonsRepository.findById(3L)).thenReturn(Optional.of(expectedUserCommons));

        MvcResult response = mockMvc.perform(get("/api/profits/admin/all/commons?userCommonsId=3"))
            .andExpect(status().isOk()).andReturn();

        verify(profitRepository, times(1)).findAllByUserCommonsId(3L);

        String responseString = response.getResponse().getContentAsString();
        List<Profit> actualProfits = objectMapper.readValue(responseString, new TypeReference<List<Profit>>() {
        });
        assertEquals(actualProfits, expectedProfits);
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void get_all_profits_by_usercommons_admin_nonexistent_test() throws Exception {
        MvcResult response = mockMvc.perform(get("/api/profits/admin/all/commons?userCommonsId=3"))
            .andExpect(status().isNotFound()).andReturn();

        verify(userCommonsRepository, times(1)).findById(3L);

        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UserCommons with id 3 not found", json.get("message"));
    }

    // Tests for create operations
    @WithMockUser(roles = { "USER" })
    @Test
    public void create_profit_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(1).build();
        Profit expectedProfit = Profit.builder().id(0).profit(100).time("03171973").userCommons(expectedUserCommons).build();
        when(profitRepository.save(expectedProfit)).thenReturn(expectedProfit);
        when(userCommonsRepository.findById(3L)).thenReturn(Optional.of(expectedUserCommons));

        MvcResult response = mockMvc
            .perform(post("/api/profits/post?profit=100&time=03171973&userCommonsId=3").with(csrf()))
            .andExpect(status().isOk()).andReturn();

        verify(userCommonsRepository, times(1)).findById(3L);
        verify(profitRepository, times(1)).save(expectedProfit);
    
        String expectedJson = mapper.writeValueAsString(expectedProfit);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void create_profit_invalid_usercommons_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(10).build();
        Profit expectedProfit = Profit.builder().id(0).profit(100).time("03171973").userCommons(expectedUserCommons).build();
        when(profitRepository.save(expectedProfit)).thenReturn(expectedProfit);
        when(userCommonsRepository.findById(3L)).thenReturn(Optional.of(expectedUserCommons));

        MvcResult response = mockMvc
            .perform(post("/api/profits/post?profit=100&time=03171973&userCommonsId=3").with(csrf()))
            .andExpect(status().isNotFound()).andReturn();

        verify(userCommonsRepository, times(1)).findById(3L);
    
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UserCommons with id 3 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void create_profit_nonexistent_usercommons_test() throws Exception {
        MvcResult response = mockMvc
            .perform(post("/api/profits/post?profit=100&time=03171973&userCommonsId=3").with(csrf()))
            .andExpect(status().isNotFound()).andReturn();

        verify(userCommonsRepository, times(1)).findById(3L);
    
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UserCommons with id 3 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void create_profit_admin_test() throws Exception {
        UserCommons expectedUserCommons = UserCommons.builder().id(3).commonsId(1).userId(10).build();
        Profit expectedProfit = Profit.builder().id(0).profit(100).time("03171973").userCommons(expectedUserCommons).build();
        when(profitRepository.save(expectedProfit)).thenReturn(expectedProfit);
        when(userCommonsRepository.findById(3L)).thenReturn(Optional.of(expectedUserCommons));

        MvcResult response = mockMvc
            .perform(post("/api/profits/admin/post?profit=100&time=03171973&userCommonsId=3").with(csrf()))
            .andExpect(status().isOk()).andReturn();

        verify(userCommonsRepository, times(1)).findById(3L);
        verify(profitRepository, times(1)).save(expectedProfit);
    
        String expectedJson = mapper.writeValueAsString(expectedProfit);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void create_profit_admin_nonexistent_usercommons_test() throws Exception {
        MvcResult response = mockMvc
            .perform(post("/api/profits/admin/post?profit=100&time=03171973&userCommonsId=3").with(csrf()))
            .andExpect(status().isNotFound()).andReturn();

        verify(userCommonsRepository, times(1)).findById(3L);
    
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UserCommons with id 3 not found", json.get("message"));
    }

    // Tests for delete operations

    // Tests for update operations
}