package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "test@test.com", roles = {"USER"})
class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Session session;

    @BeforeEach
    void setup() {
        sessionRepository.deleteAll();

        // Création d'une session de test réelle en base
        session = new Session();
        session.setName("Session test");
        session.setDate(new Date());
        session.setDescription("Description test");

        session = sessionRepository.save(session);
    }

    @Test
    void shouldGetSessionById() throws Exception {
        mockMvc.perform(get("/api/session/{id}", session.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session test"));
    }

    @Test
    void shouldReturn404WhenSessionNotFound() throws Exception {
        mockMvc.perform(get("/api/session/{id}", 999))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetAllSessions() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void shouldCreateSession() throws Exception {
        String jsonContent =
                "{"
                        + "\"name\":\"Nouvelle session\","
                        + "\"description\":\"Description\","
                        + "\"date\":\"2026-01-01\","
                        + "\"teacher_id\":1"
                        + "}";

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonContent))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nouvelle session"));
    }

    @Test
    void shouldUpdateSession() throws Exception {
        String jsonContent =
                "{"
                        + "\"name\":\"Session modifiée\","
                        + "\"description\":\"Nouvelle description\","
                        + "\"date\":\"2026-02-01\","
                        + "\"teacher_id\":1"
                        + "}";

        mockMvc.perform(put("/api/session/{id}", session.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonContent))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session modifiée"));
    }

    @Test
    void shouldDeleteSession() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", session.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturnBadRequestWhenIdIsInvalid() throws Exception {
        mockMvc.perform(get("/api/session/abc"))
                .andExpect(status().isBadRequest());
    }
}
