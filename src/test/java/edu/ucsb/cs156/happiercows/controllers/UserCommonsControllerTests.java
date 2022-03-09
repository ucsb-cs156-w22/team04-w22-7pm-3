package edu.ucsb.cs156.happiercows.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(controllers = UserCommonsController.class)
@Import(TestConfig.class)
public class UserCommonsControllerTests extends ControllerTestCase {
        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        UserCommonsRepository userCommonsRepository;

        @WithMockUser(roles = { "USER" })
        @Test
        public void users_decrement_cowCount_test() throws Exception {
        UserCommons ucTest = UserCommons.builder().id(1).commonsId(1).userId(1).totalWealth(0).numCows(10).build();
        when(userCommonsRepository.findById(1L)).thenReturn(Optional.of(ucTest));
        UserCommons ucExpected = UserCommons.builder().id(1).commonsId(1).userId(1).totalWealth(0).numCows(9).build();

        MvcResult response = mockMvc.perform(put("/api/forcurrentuser/decrementCows"))
        .andExpect(status().isOk()).andReturn();

        String responseString = response.getResponse().getContentAsString();
        UserCommons actualUserCommons = objectMapper.readValue(responseString, UserCommons.class);
        assertEquals(actualUserCommons, ucExpected);
        
    }
    
}

