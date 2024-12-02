package com.rj45.service;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import com.rj45.repository.CommentRepository;
import com.rj45.repository.PatientRepository;
import com.rj45.repository.TestRepository;
import com.rj45.repository.UserRepository;
import com.rj45.model.Test;
import com.rj45.model.Comment;
import com.rj45.model.Measurement;
import com.rj45.model.User;
import com.rj45.model.Patient;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepo;

    private final CommentRepository commentRepo;

    private final UserRepository userRepo;

    private final PatientRepository patientRepo;

    public record CommentResponse(
        UUID id,
        String content
    ) {};

    private record TestResponse(
        UUID id,
        String type,
        long timestamp,
        List<Measurement> measurements,
        Long patientId,
        Long evaluatorId,
        List<CommentResponse> comments
    ) {};

    public List<TestResponse> getAll(Long patientId, Long evaluatorId) {
        List<Test> tests = null;
        if (patientId != null && evaluatorId != null) {
            tests = testRepo.findByEvaluatorIdAndPatientId(evaluatorId, patientId);
        } else if (patientId != null) {
            tests = testRepo.findByPatientId(patientId);
        } else if (evaluatorId != null) {
            tests = testRepo.findByEvaluatorId(evaluatorId);
        } else {
            tests = testRepo.findAll();
        }

        return tests.stream().map(t -> new TestResponse(
            t.getId(),
            t.getType(),
            t.getTimestamp(),
            t.getMeasurements(),
            t.getPatient().getId(),
            t.getEvaluator().getId(),
            t.getComments().stream().map(c -> new CommentResponse(c.getId(), c.getContent())).toList()
        )).toList();
    }

    public TestResponse getById(UUID id) throws EntityNotFoundException, IllegalArgumentException {
        var t = testRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("TEST_NOT_FOUND"));
        return new TestResponse(
            t.getId(),
            t.getType(),
            t.getTimestamp(),
            t.getMeasurements(),
            t.getPatient().getId(),
            t.getEvaluator().getId(),
            t.getComments().stream().map(c -> new CommentResponse(c.getId(), c.getContent())).toList()
        );
    }

    public TestResponse add(
        String type, List<Measurement> measurements,
        Long patientId,
        Long evaluatorId
    ) throws IllegalArgumentException, EntityNotFoundException {
        if (measurements == null)
            measurements = List.of();

        User user = userRepo.findById(evaluatorId).orElseThrow(() -> new EntityNotFoundException("EVALUATOR_NOT_FOUND"));

        Patient patient = patientRepo.findById(patientId).orElseThrow(() -> new EntityNotFoundException("PATIENT_NOT_FOUND"));

        Test added = Test.builder()
            .id(UUID.randomUUID())
            .type(type)
            .measurements(measurements)
            .timestamp(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC))
            .evaluator(user)
            .patient(patient)
            .build();

        Test t = testRepo.save(added);

        return new TestResponse(
            t.getId(),
            t.getType(),
            t.getTimestamp(),
            t.getMeasurements(),
            t.getPatient().getId(),
            t.getEvaluator().getId(),
            t.getComments().stream().map(c -> new CommentResponse(c.getId(), c.getContent())).toList()
        );
    }

    public TestResponse update(
        UUID id, String type,
        List<Measurement> measurements,
        Long evaluatorId,
        Long patientId
    ) throws EntityNotFoundException, IllegalArgumentException {
        Test t = testRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("TEST_NOT_FOUND"));

        User user = null;
        if (evaluatorId != null)
            user = userRepo.findById(evaluatorId).orElseThrow(() -> new EntityNotFoundException("EVALUATOR_NOT_FOUND"));

        Patient patient = null;
        if (patientId != null)
            patient = patientRepo.findById(patientId).orElseThrow(() -> new EntityNotFoundException("PATIENT_NOT_FOUND"));

        t.setType(type != null ? type : t.getType());
        t.setEvaluator(user != null ? user : t.getEvaluator());
        t.setPatient(patient != null ? patient : t.getPatient());

        if (measurements != null) {
            // Normalize the timestamp in each measurement so they are relative to the first measurement
            long firstTimestamp = measurements.get(0).getTimestamp();
            for (Measurement m : measurements) {
                m.setTimestamp(m.getTimestamp() - firstTimestamp);
            }
            t.setMeasurements(measurements);
        }
        
        Test updated = testRepo.save(t);

        return new TestResponse(
            updated.getId(),
            updated.getType(),
            updated.getTimestamp(),
            updated.getMeasurements(),
            updated.getPatient().getId(),
            updated.getEvaluator().getId(),
            updated.getComments().stream().map(c -> new CommentResponse(c.getId(), c.getContent())).toList()
        );
    }

    public void delete(UUID id) throws EntityNotFoundException {
        if (!testRepo.existsById(id))
            throw new EntityNotFoundException("TEST_NOT_FOUND");

        testRepo.deleteById(id);
    }

    public List<CommentResponse> getComments(UUID id) {
        return this.getById(id).comments();
    }

    public TestResponse addComment(UUID id, String content) {
        Test t = testRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("TEST_NOT_FOUND"));

        var comment = new Comment(
            UUID.randomUUID(),
            content,
            LocalDateTime.now().toEpochSecond(ZoneOffset.UTC),
            t
        );

        commentRepo.save(comment);

        t.getComments().add(comment);

        return new TestResponse(
            t.getId(),
            t.getType(),
            t.getTimestamp(),
            t.getMeasurements(),
            t.getPatient().getId(),
            t.getEvaluator().getId(),
            t.getComments().stream().map(c -> new CommentResponse(c.getId(), c.getContent())).toList()
        );
    }

    public TestResponse deleteComment(UUID testId, UUID commentId) throws EntityNotFoundException {
        if (!testRepo.existsById(testId))
            throw new EntityNotFoundException("TEST_NOT_FOUND");

        commentRepo.deleteById(commentId);
            
        Test t = testRepo.findById(testId).get();

        return new TestResponse(
            t.getId(),
            t.getType(),
            t.getTimestamp(),
            t.getMeasurements(),
            t.getPatient().getId(),
            t.getEvaluator().getId(),
            t.getComments().stream().map(c -> new CommentResponse(c.getId(), c.getContent())).toList()
        );

    }

    public Object editComment(UUID testId, UUID commentId, String content) {
        if (!testRepo.existsById(testId))
            throw new EntityNotFoundException("TEST_NOT_FOUND");

        var comment = commentRepo.findById(commentId).orElseThrow(() -> new EntityNotFoundException("COMMENT_NOT_FOUND"));

        comment.setContent(content);

        commentRepo.save(comment);

        Test t = testRepo.findById(testId).get();

        return new TestResponse(
            t.getId(),
            t.getType(),
            t.getTimestamp(),
            t.getMeasurements(),
            t.getPatient().getId(),
            t.getEvaluator().getId(),
            t.getComments().stream().map(c -> new CommentResponse(c.getId(), c.getContent())).toList()
        );
    }

}
