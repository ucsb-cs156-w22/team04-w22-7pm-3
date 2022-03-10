package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.http.MediaType;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(controllers = CommonsController.class)
public class CommonsControllerTests extends ControllerTestCase {

  @MockBean
  UserCommonsRepository userCommonsRepository;

  @MockBean
  UserRepository userRepository;

  @MockBean
  CommonsRepository commonsRepository;

  @Autowired
  private ObjectMapper objectMapper;

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void createCommonsTest() throws Exception {
    String testName = "TestCommons";
    double testCowPrice = 10.4;
    double testMilkPrice = 5.6;
    double testStartingBalance = 50.0;
    Date testStartDate = new Date(1646687907L);
    Date testEndDate = new Date(1846687907L);
    Commons expectedCommons = Commons.builder()
            .name(testName)
            .cowPrice(testCowPrice)
            .milkPrice(testMilkPrice)
            .startingBalance(testStartingBalance)
            .startDate(testStartDate)
            .endDate(testEndDate)
            .build();
    ObjectMapper mapper = new ObjectMapper();
    String requestBody = mapper.writeValueAsString(expectedCommons);
    when(commonsRepository.save(any())).thenReturn(expectedCommons);

    MvcResult response = mockMvc
        .perform(post(
                String.format("/api/commons/new?name=%s?cowPrice=%f?milkPrice=%f?startingBalance=%f?startDate=%s?endDate=%s",
                        testName, testCowPrice, testMilkPrice, testStartingBalance, testStartDate, testEndDate)
        ).with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .characterEncoding("utf-8").content(requestBody))
        .andExpect(status().isOk()).andReturn();

    verify(commonsRepository, times(1)).save(expectedCommons);

    String responseString = response.getResponse().getContentAsString();
    Commons actualCommons = objectMapper.readValue(responseString, Commons.class);
    assertEquals(actualCommons, expectedCommons);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void deleteCommonsTestAsUSER() throws Exception {
    mockMvc.perform(delete("/api/commons/delete")).andExpect(status().is(403));
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void deleteExistingCommonsTestAsADMIN() throws Exception {
    final long testId = 1L;

    String testName = "TestCommons";
    double testCowPrice = 10.4;
    double testMilkPrice = 5.6;
    double testStartingBalance = 50.0;
    Date testStartDate = new Date(1646687907L);
    Date testEndDate = new Date(1846687907L);

    Commons commons = Commons.builder()
            .name(testName)
            .cowPrice(testCowPrice)
            .milkPrice(testMilkPrice)
            .startingBalance(testStartingBalance)
            .startDate(testStartDate)
            .endDate(testEndDate)
            .id(testId)
            .build();

    when(commonsRepository.findById(eq(testId))).thenReturn(Optional.of(commons));

    MvcResult resp = mockMvc.perform(delete("/api/commons/delete?commonsId=1")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    verify(commonsRepository, times(1)).findById(testId);
    verify(commonsRepository, times(1)).deleteById(testId);
    assertEquals(String.format("commons with id %d deleted", 1), resp.getResponse().getContentAsString());
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void deleteNonExistingCommonsTestAsADMIN() throws Exception {
    final long testId = 1L;
    when(commonsRepository.findById(eq(testId))).thenReturn(Optional.empty());

    MvcResult response = mockMvc.perform(delete("/api/commons/delete?commonsId=1")
                    .with(csrf()))
            .andExpect(status().is(404))
            .andReturn();

    verify(commonsRepository, times(1)).findById(testId);
    String responseJsonString = response.getResponse().getContentAsString();
    ObjectNode responseJson = mapper.readValue(responseJsonString, ObjectNode.class);
    String responseString = responseJson.get("message").asText();
    String expectedString = (new EntityNotFoundException(Commons.class, testId)).getMessage();

    assertEquals(expectedString, responseString);

  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void getCommonsTest() throws Exception {
    List<Commons> expectedCommons = new ArrayList<Commons>();
    Commons Commons1 = Commons.builder().name("TestCommons1").build();

    expectedCommons.add(Commons1);
    when(commonsRepository.findAll()).thenReturn(expectedCommons);
    MvcResult response = mockMvc.perform(get("/api/commons/all").contentType("application/json"))
        .andExpect(status().isOk()).andReturn();

    verify(commonsRepository, times(1)).findAll();

    String responseString = response.getResponse().getContentAsString();
    List<Commons> actualCommons = objectMapper.readValue(responseString, new TypeReference<List<Commons>>() {
    });
    assertEquals(actualCommons, expectedCommons);
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void joinCommonsTest() throws Exception {

    Commons c = Commons.builder()
      .id(2L)
      .name("Example Commons")
      .build();

    UserCommons uc = UserCommons.builder()
        .userId(1L)
        .commonsId(2L)
        .totalWealth(0)
        .build();

    UserCommons ucSaved = UserCommons.builder()
        .id(17L)
        .userId(1L)
        .commonsId(2L)
        .totalWealth(0)
        .build();

    String requestBody = mapper.writeValueAsString(uc);

    when(userCommonsRepository.findByCommonsIdAndUserId(anyLong(),anyLong())).thenReturn(Optional.empty());
    when(userCommonsRepository.save(eq(uc))).thenReturn(ucSaved);
    when(commonsRepository.findById(eq(2L))).thenReturn(Optional.of(c));

    MvcResult response = mockMvc
        .perform(post("/api/commons/join?commonsId=2").with(csrf()).contentType(MediaType.APPLICATION_JSON)
            .characterEncoding("utf-8").content(requestBody))
        .andExpect(status().isOk()).andReturn();

    verify(userCommonsRepository, times(1)).findByCommonsIdAndUserId(2L, 1L);
    verify(userCommonsRepository, times(1)).save(uc);

    String responseString = response.getResponse().getContentAsString();
    String cAsJson = mapper.writeValueAsString(c);

    assertEquals(responseString, cAsJson);
  }

}
