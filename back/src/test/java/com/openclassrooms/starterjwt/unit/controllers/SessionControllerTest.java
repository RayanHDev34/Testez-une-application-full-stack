package com.openclassrooms.starterjwt.unit.controllers;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;


    @Test
    void shouldReturnSessionWhenIdIsValid() {
        Session session = new Session();
        SessionDto dto = new SessionDto();

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void shouldReturn404WhenSessionNotFound() {
        when(sessionService.getById(1L)).thenReturn(null);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void shouldReturn400WhenIdIsInvalid() {
        ResponseEntity<?> response = sessionController.findById("abc");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void shouldReturnAllSessions() {
        List<Session> sessions = List.of(new Session(), new Session());
        List<SessionDto> dtos = List.of(new SessionDto(), new SessionDto());

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(dtos);

        ResponseEntity<?> response = sessionController.findAll();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dtos, response.getBody());
    }

    @Test
    void shouldCreateSession() {
        SessionDto dto = new SessionDto();
        Session entity = new Session();

        when(sessionMapper.toEntity(dto)).thenReturn(entity);
        when(sessionService.create(entity)).thenReturn(entity);
        when(sessionMapper.toDto(entity)).thenReturn(dto);

        ResponseEntity<?> response = sessionController.create(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void shouldUpdateSession() {
        SessionDto dto = new SessionDto();
        Session entity = new Session();

        when(sessionMapper.toEntity(dto)).thenReturn(entity);
        when(sessionService.update(1L, entity)).thenReturn(entity);
        when(sessionMapper.toDto(entity)).thenReturn(dto);

        ResponseEntity<?> response = sessionController.update("1", dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void shouldReturn400WhenUpdateIdInvalid() {
        ResponseEntity<?> response = sessionController.update("abc", new SessionDto());

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void shouldDeleteSession() {
        when(sessionService.getById(1L)).thenReturn(new Session());

        ResponseEntity<?> response = sessionController.save("1");

        assertEquals(200, response.getStatusCodeValue());
        verify(sessionService).delete(1L);
    }

    @Test
    void shouldReturn404WhenDeletingUnknownSession() {
        when(sessionService.getById(1L)).thenReturn(null);

        ResponseEntity<?> response = sessionController.save("1");

        assertEquals(404, response.getStatusCodeValue());
    }


    @Test
    void shouldParticipateToSession() {
        ResponseEntity<?> response = sessionController.participate("1", "2");

        assertEquals(200, response.getStatusCodeValue());
        verify(sessionService).participate(1L, 2L);
    }

    @Test
    void shouldReturn400WhenParticipateIdsInvalid() {
        ResponseEntity<?> response = sessionController.participate("abc", "def");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void shouldUnParticipateFromSession() {
        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "2");

        assertEquals(200, response.getStatusCodeValue());
        verify(sessionService).noLongerParticipate(1L, 2L);
    }

    @Test
    void shouldReturn400WhenUnParticipateIdsInvalid() {
        ResponseEntity<?> response = sessionController.noLongerParticipate("abc", "def");

        assertEquals(400, response.getStatusCodeValue());
    }
}
