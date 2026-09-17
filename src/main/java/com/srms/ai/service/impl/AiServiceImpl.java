package com.srms.ai.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.srms.ai.dto.response.AiAnalysisResponse;
import com.srms.ai.dto.response.AiCareerRecommendationResponse;
import com.srms.ai.dto.response.AiChatResponse;
import com.srms.ai.dto.response.AiStatisticsResponse;
import com.srms.ai.dto.response.AiStudyPlanResponse;
import com.srms.ai.dto.response.AiSubjectAnalysisResponse;
import com.srms.ai.dto.response.TeacherAiStatisticsResponse;
import com.srms.ai.service.AiService;
import com.srms.ai.service.AiStatisticsService;
import com.srms.ai.service.TeacherAiStatisticsService;
import com.srms.dto.response.ApiResponse;
import com.srms.entity.Result;
import com.srms.entity.ResultSubject;
import com.srms.entity.Student;
import com.srms.entity.Teacher;
import com.srms.entity.TeacherSubject;
import com.srms.entity.User;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.repository.ResultRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.TeacherRepository;
import com.srms.repository.TeacherSubjectRepository;
import com.srms.repository.UserRepository;
import com.srms.ai.dto.response.AiSubjectAnalysisResponse;
import org.springframework.transaction.annotation.Transactional;
import com.srms.enums.Role;
import com.srms.entity.Subject;
import com.srms.entity.Student;
import com.srms.entity.Result;
import com.srms.entity.ResultSubject;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

        private final ChatClient chatClient;

        private final UserRepository userRepository;
        private final StudentRepository studentRepository;
        private final ResultRepository resultRepository;
        private final AiStatisticsService aiStatisticsService;
        private final TeacherRepository teacherRepository;
        private final TeacherSubjectRepository teacherSubjectRepository;
        private final TeacherAiStatisticsService teacherAiStatisticsService;

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<AiAnalysisResponse> analyzeStudentPerformance(
                        String username) {
                // Find user
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // Find student
                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                // Get student's results
                List<Result> results = resultRepository.findByStudentIdOrderBySemesterSemesterNumberAsc(
                                student.getId());

                if (results.isEmpty()) {
                        throw new BadRequestException(
                                        "No results found for this student.");
                }

                // Build academic context
                String academicData = buildAcademicContext(student, results);

                // AI prompt
                String prompt = """
                                You are an AI Academic Performance Analyzer
                                for a Student Result Management System.

                                Analyze the following student's academic data.

                                STUDENT:
                                Name: %s
                                Roll No: %s

                                ACADEMIC DATA:
                                %s

                                Provide a concise but useful academic analysis.

                                Your response MUST contain exactly these sections:

                                OVERALL SUMMARY:
                                <summary>

                                PERFORMANCE TREND:
                                <trend>

                                STRENGTHS:
                                - <strength 1>
                                - <strength 2>

                                AREAS FOR IMPROVEMENT:
                                - <area 1>
                                - <area 2>

                                RECOMMENDATIONS:
                                - <recommendation 1>
                                - <recommendation 2>

                                Do not invent marks, grades, subjects or statistics.
                                Use only the information provided.
                                """.formatted(
                                student.getFirstName()
                                                + " "
                                                + student.getLastName(),
                                student.getRollNo(),
                                academicData);

                // Call AI
                String aiResponse = chatClient
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();

                // Convert AI text into structured response
                AiAnalysisResponse response = parseAiResponse(aiResponse);

                return ApiResponse.<AiAnalysisResponse>builder()
                                .success(true)
                                .message("AI Performance Analysis Generated")
                                .data(response)
                                .build();
        }

        private String buildAcademicContext(
                        Student student,
                        List<Result> results) {

                StringBuilder data = new StringBuilder();

                for (Result result : results) {

                        data.append("\nSemester: ")
                                        .append(result.getSemester()
                                                        .getSemesterName());

                        data.append("\nSGPA: ")
                                        .append(result.getSgpa());

                        data.append("\nPercentage: ")
                                        .append(result.getPercentage());

                        data.append("\nResult Status: ")
                                        .append(result.getResultStatus());

                        data.append("\nSubjects:\n");

                        for (ResultSubject subject : result.getResultSubjects()) {

                                data.append("- ")
                                                .append(subject.getSubject()
                                                                .getSubjectName())
                                                .append(" | Credits: ")
                                                .append(subject.getCredits())
                                                .append(" | Grade: ")
                                                .append(subject.getGrade())
                                                .append(" | Grade Point: ")
                                                .append(subject.getGradePoint())
                                                .append(" | Marks: ")
                                                .append(subject.getObtainedMarks())
                                                .append("/")
                                                .append(subject.getTotalMarks())
                                                .append("\n");
                        }
                }

                return data.toString();
        }

        private AiAnalysisResponse parseAiResponse(
                        String aiResponse) {

                String overallSummary = extractSection(
                                aiResponse,
                                "OVERALL SUMMARY:",
                                "PERFORMANCE TREND:");

                String performanceTrend = extractSection(
                                aiResponse,
                                "PERFORMANCE TREND:",
                                "STRENGTHS:");

                List<String> strengths = extractList(
                                aiResponse,
                                "STRENGTHS:",
                                "AREAS FOR IMPROVEMENT:");

                List<String> areasForImprovement = extractList(
                                aiResponse,
                                "AREAS FOR IMPROVEMENT:",
                                "RECOMMENDATIONS:");

                List<String> recommendations = extractList(
                                aiResponse,
                                "RECOMMENDATIONS:",
                                null);

                return AiAnalysisResponse.builder()
                                .overallSummary(overallSummary)
                                .performanceTrend(performanceTrend)
                                .strengths(strengths)
                                .areasForImprovement(areasForImprovement)
                                .recommendations(recommendations)
                                .build();
        }

        private String extractSection(
                        String text,
                        String start,
                        String end) {

                int startIndex = text.indexOf(start);

                if (startIndex == -1) {
                        return "";
                }

                startIndex += start.length();

                int endIndex = end == null
                                ? text.length()
                                : text.indexOf(end, startIndex);

                if (endIndex == -1) {
                        endIndex = text.length();
                }

                return text.substring(startIndex, endIndex)
                                .trim();
        }

        private List<String> extractList(
                        String text,
                        String start,
                        String end) {

                String section = extractSection(text, start, end);

                return section.lines()
                                .map(String::trim)
                                .filter(line -> line.startsWith("-"))
                                .map(line -> line.substring(1).trim())
                                .filter(line -> !line.isBlank())
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<List<AiSubjectAnalysisResponse>> analyzeSubjects(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                List<Result> results = resultRepository.findByStudentIdOrderBySemesterSemesterNumberAsc(
                                student.getId());

                if (results.isEmpty()) {
                        throw new BadRequestException(
                                        "No results found for this student.");
                }

                String academicData = buildAcademicContext(student, results);

                String prompt = """
                                You are an AI Academic Subject Risk Analyzer
                                for a Student Result Management System.

                                Analyze the student's subjects using ONLY the
                                academic data provided below.

                                STUDENT:
                                Name: %s
                                Roll No: %s

                                ACADEMIC DATA:
                                %s

                                For EVERY subject, provide:

                                SUBJECT:
                                <subject name>

                                RISK LEVEL:
                                <LOW / MEDIUM / HIGH>

                                ANALYSIS:
                                <short analysis>

                                RECOMMENDATION:
                                <short recommendation>

                                Rules:

                                1. HIGH risk means poor marks/grade and requires
                                   significant improvement.

                                2. MEDIUM risk means average performance and
                                   improvement is recommended.

                                3. LOW risk means good or excellent performance.

                                4. Do not invent marks, grades or subjects.

                                5. Use only the provided academic data.

                                6. Analyze every subject exactly once.

                                Return the analysis in this format:

                                SUBJECT: <subject name>
                                RISK LEVEL: <risk>
                                ANALYSIS: <analysis>
                                RECOMMENDATION: <recommendation>

                                SUBJECT: <subject name>
                                RISK LEVEL: <risk>
                                ANALYSIS: <analysis>
                                RECOMMENDATION: <recommendation>
                                """.formatted(
                                student.getFirstName() + " "
                                                + student.getLastName(),
                                student.getRollNo(),
                                academicData);

                String aiResponse = chatClient
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();

                List<AiSubjectAnalysisResponse> response = parseSubjectAnalysis(aiResponse, results);

                return ApiResponse.<List<AiSubjectAnalysisResponse>>builder()
                                .success(true)
                                .message("AI Subject Analysis Generated")
                                .data(response)
                                .build();
        }

        private List<AiSubjectAnalysisResponse> parseSubjectAnalysis(
                        String aiResponse,
                        List<Result> results) {

                List<AiSubjectAnalysisResponse> response = new java.util.ArrayList<>();

                String[] blocks = aiResponse.split("SUBJECT:");

                for (int i = 1; i < blocks.length; i++) {

                        String block = blocks[i].trim();

                        String subjectName = extractSection(
                                        block,
                                        "",
                                        "RISK LEVEL:");

                        String riskLevel = extractSection(
                                        block,
                                        "RISK LEVEL:",
                                        "ANALYSIS:");

                        String analysis = extractSection(
                                        block,
                                        "ANALYSIS:",
                                        "RECOMMENDATION:");

                        String recommendation = extractSection(
                                        block,
                                        "RECOMMENDATION:",
                                        null);

                        ResultSubject matchedSubject = null;

                        for (Result result : results) {

                                for (ResultSubject resultSubject : result.getResultSubjects()) {

                                        if (resultSubject.getSubject()
                                                        .getSubjectName()
                                                        .equalsIgnoreCase(subjectName.trim())) {

                                                matchedSubject = resultSubject;
                                                break;
                                        }
                                }

                                if (matchedSubject != null) {
                                        break;
                                }
                        }

                        if (matchedSubject != null) {

                                response.add(
                                                AiSubjectAnalysisResponse.builder()
                                                                .subjectId(
                                                                                matchedSubject.getSubject().getId())
                                                                .subjectCode(
                                                                                matchedSubject.getSubject()
                                                                                                .getSubjectCode())
                                                                .subjectName(
                                                                                matchedSubject.getSubject()
                                                                                                .getSubjectName())
                                                                .marks(
                                                                                matchedSubject.getObtainedMarks())
                                                                .grade(
                                                                                matchedSubject.getGrade() != null
                                                                                                ? matchedSubject.getGrade()
                                                                                                                .name()
                                                                                                : null)
                                                                .gradePoint(
                                                                                matchedSubject.getGradePoint())
                                                                .riskLevel(riskLevel.trim())
                                                                .analysis(analysis.trim())
                                                                .recommendation(
                                                                                recommendation.trim())
                                                                .build());
                        }
                }

                return response;
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<AiStudyPlanResponse> generateStudyPlan(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                List<Result> results = resultRepository
                                .findByStudentIdOrderBySemesterSemesterNumberAsc(
                                                student.getId());

                if (results.isEmpty()) {
                        throw new BadRequestException(
                                        "No results found for this student.");
                }

                String academicData = buildAcademicContext(student, results);

                String prompt = """
                                You are an AI Academic Study Planner
                                for a Student Result Management System.

                                Create a personalized study plan based ONLY
                                on the student's academic performance.

                                STUDENT:
                                Name: %s
                                Roll No: %s

                                ACADEMIC DATA:
                                %s

                                Identify subjects where the student has:

                                - Low marks
                                - Low grades
                                - Low grade points
                                - Declining performance
                                - Areas requiring additional preparation

                                Give higher priority to weaker subjects.

                                Create a practical study plan.

                                The response MUST follow exactly this format:

                                OVERALL ADVICE:
                                <short overall advice>

                                STUDY PLAN:

                                SUBJECT:
                                <subject name>

                                PRIORITY:
                                <HIGH / MEDIUM / LOW>

                                TOPICS:
                                - <topic 1>
                                - <topic 2>
                                - <topic 3>

                                RECOMMENDED HOURS:
                                <number>

                                REASON:
                                <reason>

                                Repeat the STUDY PLAN block for each
                                important subject.

                                Rules:

                                1. Do not invent marks or grades.

                                2. Use only the provided academic data.

                                3. Prioritize weak subjects.

                                4. Recommended hours must be realistic.

                                5. Keep the plan concise and practical.

                                6. Do not recommend topics that cannot reasonably
                                   be inferred from the subject name or academic data.
                                """.formatted(
                                student.getFirstName() + " "
                                                + student.getLastName(),
                                student.getRollNo(),
                                academicData);

                String aiResponse = chatClient
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();

                AiStudyPlanResponse response = parseStudyPlan(aiResponse);

                return ApiResponse.<AiStudyPlanResponse>builder()
                                .success(true)
                                .message("AI Study Plan Generated")
                                .data(response)
                                .build();
        }

        private AiStudyPlanResponse parseStudyPlan(
                        String aiResponse) {

                String overallAdvice = extractSection(
                                aiResponse,
                                "OVERALL ADVICE:",
                                "STUDY PLAN:");

                List<AiStudyPlanResponse.StudyPlanItem> studyPlan = new java.util.ArrayList<>();

                String[] blocks = aiResponse.split("SUBJECT:");

                for (int i = 1; i < blocks.length; i++) {

                        String block = blocks[i].trim();

                        String subject = extractSection(
                                        block,
                                        "",
                                        "PRIORITY:");

                        String priority = extractSection(
                                        block,
                                        "PRIORITY:",
                                        "TOPICS:");

                        String topicsSection = extractSection(
                                        block,
                                        "TOPICS:",
                                        "RECOMMENDED HOURS:");

                        List<String> topics = topicsSection
                                        .lines()
                                        .map(String::trim)
                                        .filter(line -> line.startsWith("-"))
                                        .map(line -> line.substring(1).trim())
                                        .filter(line -> !line.isBlank())
                                        .collect(Collectors.toList());

                        String hoursText = extractSection(
                                        block,
                                        "RECOMMENDED HOURS:",
                                        "REASON:");

                        Integer recommendedHours = null;

                        try {
                                recommendedHours = Integer.parseInt(
                                                hoursText.trim()
                                                                .replaceAll("[^0-9]", ""));
                        } catch (Exception ignored) {
                        }

                        String reason = extractSection(
                                        block,
                                        "REASON:",
                                        null);

                        if (!subject.isBlank()) {

                                studyPlan.add(
                                                AiStudyPlanResponse.StudyPlanItem.builder()
                                                                .subject(subject.trim())
                                                                .priority(priority.trim())
                                                                .topics(topics)
                                                                .recommendedHours(
                                                                                recommendedHours)
                                                                .reason(reason.trim())
                                                                .build());
                        }
                }

                return AiStudyPlanResponse.builder()
                                .overallAdvice(overallAdvice)
                                .studyPlan(studyPlan)
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<AiCareerRecommendationResponse> recommendCareer(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                List<Result> results = resultRepository
                                .findByStudentIdOrderBySemesterSemesterNumberAsc(
                                                student.getId());

                if (results.isEmpty()) {
                        throw new BadRequestException(
                                        "No results found for this student.");
                }

                String academicData = buildAcademicContext(student, results);

                String prompt = """
                                You are an AI Career Guidance Assistant
                                for a Student Result Management System.

                                Analyze the student's academic performance
                                and recommend suitable career paths.

                                STUDENT:
                                Name: %s
                                Roll No: %s

                                ACADEMIC DATA:
                                %s

                                Analyze:

                                1. Strong subjects
                                2. Weak subjects
                                3. Grade performance
                                4. Practical/project performance
                                5. Academic trends
                                6. Technical areas where the student performs well

                                Recommend realistic technology-related career paths.

                                The response MUST follow exactly this format:

                                CAREER SUMMARY:
                                <summary>

                                CAREER:
                                <career name>

                                SUITABILITY:
                                <HIGH / MEDIUM / LOW>

                                REASON:
                                <reason>

                                RELEVANT SUBJECTS:
                                - <subject>
                                - <subject>

                                RECOMMENDED SKILLS:
                                - <skill>
                                - <skill>

                                Repeat the CAREER block for each suitable career.

                                SKILL RECOMMENDATIONS:
                                - <skill>
                                - <skill>
                                - <skill>

                                Rules:

                                1. Use ONLY the academic information provided.

                                2. Do not invent marks or grades.

                                3. Do not guarantee employment or career success.

                                4. Recommendations should be based on academic evidence.

                                5. Keep recommendations practical.
                                """.formatted(
                                student.getFirstName() + " "
                                                + student.getLastName(),
                                student.getRollNo(),
                                academicData);

                String aiResponse = chatClient
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();

                AiCareerRecommendationResponse response = parseCareerRecommendation(aiResponse);

                return ApiResponse.<AiCareerRecommendationResponse>builder()
                                .success(true)
                                .message("AI Career Recommendation Generated")
                                .data(response)
                                .build();
        }

        private AiCareerRecommendationResponse parseCareerRecommendation(
                        String aiResponse) {

                String careerSummary = extractSection(
                                aiResponse,
                                "CAREER SUMMARY:",
                                "CAREER:");

                List<AiCareerRecommendationResponse.CareerRecommendation> careers = new java.util.ArrayList<>();

                String[] blocks = aiResponse.split("CAREER:");

                for (int i = 1; i < blocks.length; i++) {

                        String block = blocks[i].trim();

                        String career = extractSection(
                                        block,
                                        "",
                                        "SUITABILITY:");

                        String suitability = extractSection(
                                        block,
                                        "SUITABILITY:",
                                        "REASON:");

                        String reason = extractSection(
                                        block,
                                        "REASON:",
                                        "RELEVANT SUBJECTS:");

                        String subjectsSection = extractSection(
                                        block,
                                        "RELEVANT SUBJECTS:",
                                        "RECOMMENDED SKILLS:");

                        List<String> relevantSubjects = subjectsSection
                                        .lines()
                                        .map(String::trim)
                                        .filter(line -> line.startsWith("-"))
                                        .map(line -> line.substring(1).trim())
                                        .filter(line -> !line.isBlank())
                                        .collect(Collectors.toList());

                        String skillsSection = extractSection(
                                        block,
                                        "RECOMMENDED SKILLS:",
                                        "CAREER:");

                        List<String> recommendedSkills = skillsSection
                                        .lines()
                                        .map(String::trim)
                                        .filter(line -> line.startsWith("-"))
                                        .map(line -> line.substring(1).trim())
                                        .filter(line -> !line.isBlank())
                                        .collect(Collectors.toList());

                        if (!career.isBlank()) {

                                careers.add(
                                                AiCareerRecommendationResponse.CareerRecommendation
                                                                .builder()
                                                                .career(career.trim())
                                                                .suitability(suitability.trim())
                                                                .reason(reason.trim())
                                                                .relevantSubjects(relevantSubjects)
                                                                .recommendedSkills(recommendedSkills)
                                                                .build());
                        }
                }

                String skillsStart = "SKILL RECOMMENDATIONS:";

                List<String> skillRecommendations = extractSection(
                                aiResponse,
                                skillsStart,
                                null)
                                .lines()
                                .map(String::trim)
                                .filter(line -> line.startsWith("-"))
                                .map(line -> line.substring(1).trim())
                                .filter(line -> !line.isBlank())
                                .collect(Collectors.toList());

                return AiCareerRecommendationResponse.builder()
                                .careerSummary(careerSummary)
                                .careers(careers)
                                .skillRecommendations(skillRecommendations)
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<AiChatResponse> chat(
                        String username,
                        String question) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                List<Result> results = resultRepository
                                .findByStudentIdOrderBySemesterSemesterNumberAsc(
                                                student.getId());

                if (results.isEmpty()) {
                        throw new BadRequestException(
                                        "No academic results found for this student.");
                }

                String academicData = buildAcademicContext(student, results);

                String prompt = """
                                You are an AI Academic Assistant inside a
                                Student Result Management System.

                                You are answering questions about the student's
                                own academic performance.

                                STUDENT:
                                Name: %s
                                Roll No: %s

                                STUDENT ACADEMIC DATA:
                                %s

                                STUDENT QUESTION:
                                %s

                                Instructions:

                                1. Answer the student's question clearly.

                                2. Use ONLY the academic data provided.

                                3. Do not invent marks, grades, subjects,
                                   SGPA, percentages or statistics.

                                4. If the requested information is not available
                                   in the academic data, clearly say that it is
                                   not available.

                                5. Give practical academic advice when appropriate.

                                6. Keep the response concise but useful.

                                7. Do not claim to be a human teacher or university
                                   authority.
                                """.formatted(
                                student.getFirstName()
                                                + " "
                                                + student.getLastName(),
                                student.getRollNo(),
                                academicData,
                                question);

                String answer = chatClient
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();

                AiChatResponse response = AiChatResponse.builder()
                                .question(question)
                                .answer(answer)
                                .build();

                return ApiResponse.<AiChatResponse>builder()
                                .success(true)
                                .message("AI Response Generated")
                                .data(response)
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<AiChatResponse> adminAnalytics(
                        String username,
                        String question) {

                // =====================================================
                // 1. VERIFY ADMIN
                // =====================================================

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                if (user.getRole() != Role.ADMIN) {
                        throw new BadRequestException(
                                        "Only administrators can access AI analytics.");
                }

                // =====================================================
                // 2. GET VERIFIED STATISTICS
                // =====================================================

                AiStatisticsResponse statistics = aiStatisticsService.generateStatistics();

                String statisticsJson;

                try {

                        ObjectMapper objectMapper = new ObjectMapper();

                        statisticsJson = objectMapper
                                        .writerWithDefaultPrettyPrinter()
                                        .writeValueAsString(statistics);

                } catch (JsonProcessingException e) {

                        throw new BadRequestException(
                                        "Unable to prepare academic statistics.");
                }

                // =====================================================
                // 3. AI PROMPT
                // =====================================================

                String prompt = """
                                You are the SRMS Admin AI Assistant.

                                Your job is to help an administrator understand
                                academic performance data from the Student Result
                                Management System.

                                The academic statistics below were calculated directly
                                by the Java application from the university database.

                                These statistics are VERIFIED and AUTHORITATIVE.

                                =====================================================
                                STRICT DATA RULES
                                =====================================================

                                1. Use ONLY the verified statistics provided below.

                                2. NEVER invent students, subjects, departments,
                                   semesters, marks, percentages, SGPA or results.

                                3. NEVER change, calculate differently, or estimate
                                   numerical values.

                                4. If information requested by the administrator is
                                   not available in the verified statistics, say:

                                   "This information is not available in the current
                                   SRMS data."

                                5. Do not make assumptions about missing data.

                                =====================================================
                                RESPONSE STYLE
                                =====================================================

                                Give the answer in SIMPLE ENGLISH.

                                Make the answer easy for an administrator to read.

                                DO NOT write one large paragraph.

                                Use short sections and bullet points.

                                Each important point must appear on a separate line.

                                DO NOT use Markdown symbols such as:

                                ###
                                **
                                ***
                                ---

                                Do not return raw Markdown.

                                Do not use unnecessary technical terminology.

                                Explain what the numbers mean in simple words.

                                =====================================================
                                RESPONSE FORMAT
                                =====================================================

                                Use this structure when appropriate:

                                Summary

                                Give a short 1-2 sentence answer to the question.

                                Key Findings

                                • Point 1
                                • Point 2
                                • Point 3

                                Performance Details

                                • Relevant statistic
                                • Relevant statistic

                                Recommendation

                                • Give a practical recommendation if the data supports one.

                                IMPORTANT:

                                - Only include sections that are relevant to the question.
                                - Do not repeat the same information.
                                - Keep the answer concise.
                                - If the administrator asks a simple question,
                                  give a simple direct answer.
                                - If the administrator asks for detailed analysis,
                                  provide more details using bullet points.

                                =====================================================
                                VERIFIED ACADEMIC STATISTICS
                                =====================================================

                                %s

                                =====================================================
                                ADMINISTRATOR QUESTION
                                =====================================================

                                %s

                                =====================================================
                                FINAL INSTRUCTION
                                =====================================================

                                Answer the administrator's question using only the
                                verified academic statistics above.

                                Make the response clear, professional and easy
                                for a non-technical administrator to understand.

                                Do not output Markdown formatting characters.
                                """.formatted(
                                statisticsJson,
                                question);

                // =====================================================
                // 4. CALL AI
                // =====================================================

                String answer = chatClient
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();

                // =====================================================
                // 5. CLEAN AI RESPONSE
                // =====================================================

                if (answer == null || answer.trim().isEmpty()) {

                        answer = "I could not generate an answer from the available "
                                        + "SRMS data.";
                }

                // Remove common Markdown formatting if the model
                // still returns it.

                answer = answer
                                .replace("### ", "")
                                .replace("## ", "")
                                .replace("# ", "")
                                .replace("***", "")
                                .replace("**", "")
                                .replace("__", "");

                // =====================================================
                // 6. CREATE RESPONSE
                // =====================================================

                AiChatResponse response = AiChatResponse.builder()
                                .question(question)
                                .answer(answer.trim())
                                .build();

                // =====================================================
                // 7. RETURN API RESPONSE
                // =====================================================

                return ApiResponse.<AiChatResponse>builder()
                                .success(true)
                                .message("AI Admin Analytics Generated")
                                .data(response)
                                .build();
        }

        private String buildAdminAcademicContext(
                        List<Result> results) {

                StringBuilder data = new StringBuilder();

                data.append("TOTAL RESULT RECORDS: ")
                                .append(results.size())
                                .append("\n\n");

                for (Result result : results) {

                        Student student = result.getStudent();

                        data.append("STUDENT:\n");

                        data.append("Student ID: ")
                                        .append(student.getId())
                                        .append("\n");

                        data.append("Name: ")
                                        .append(student.getFirstName())
                                        .append(" ")
                                        .append(student.getLastName())
                                        .append("\n");

                        data.append("Roll No: ")
                                        .append(student.getRollNo())
                                        .append("\n");

                        data.append("Semester: ")
                                        .append(result.getSemester()
                                                        .getSemesterName())
                                        .append("\n");

                        data.append("SGPA: ")
                                        .append(result.getSgpa())
                                        .append("\n");

                        data.append("Percentage: ")
                                        .append(result.getPercentage())
                                        .append("\n");

                        data.append("Result Status: ")
                                        .append(result.getResultStatus())
                                        .append("\n");

                        data.append("Subjects:\n");

                        for (ResultSubject resultSubject : result.getResultSubjects()) {

                                data.append("  - Subject Code: ")
                                                .append(resultSubject.getSubject()
                                                                .getSubjectCode())
                                                .append("\n");

                                data.append("    Subject Name: ")
                                                .append(resultSubject.getSubject()
                                                                .getSubjectName())
                                                .append("\n");

                                data.append("    Marks: ")
                                                .append(resultSubject.getObtainedMarks())
                                                .append("/")
                                                .append(resultSubject.getTotalMarks())
                                                .append("\n");

                                data.append("    Percentage: ")
                                                .append(resultSubject.getPercentage())
                                                .append("\n");

                                data.append("    Grade: ")
                                                .append(resultSubject.getGrade())
                                                .append("\n");

                                data.append("    Grade Point: ")
                                                .append(resultSubject.getGradePoint())
                                                .append("\n");

                                data.append("    Credits: ")
                                                .append(resultSubject.getCredits())
                                                .append("\n");
                        }

                        data.append("\n-----------------------------\n\n");
                }

                return data.toString();
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<AiChatResponse> teacherChat(
                        String username,
                        String question) {

                // Find logged-in teacher
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                // Get subjects assigned to this teacher
                List<TeacherSubject> assignments = teacherSubjectRepository.findByTeacher(teacher);

                if (assignments.isEmpty()) {
                        throw new BadRequestException(
                                        "No subjects are assigned to this teacher.");
                }

                // Build academic context only from assigned subjects
                String academicData = buildTeacherAcademicContext(assignments);

                String prompt = """
                                You are an AI Academic Assistant
                                for a Student Result Management System.

                                You are assisting a teacher.

                                TEACHER:
                                Name: %s
                                Teacher Code: %s
                                Department: %s

                                ASSIGNED SUBJECT ACADEMIC DATA:
                                %s

                                TEACHER QUESTION:
                                %s

                                Instructions:

                                1. Answer only using the academic data provided.

                                2. The teacher can only access information
                                   related to subjects assigned to them.

                                3. Do not invent students, marks, grades,
                                   percentages or statistics.

                                4. If the requested information is not available,
                                   clearly say that it is not available.

                                5. You may identify:
                                   - weak students
                                   - strong students
                                   - weak subjects
                                   - strong subjects
                                   - low marks
                                   - performance patterns
                                   - students requiring attention

                                6. Give practical academic suggestions
                                   when appropriate.

                                7. Keep the answer concise and professional.

                                8. Never expose passwords, JWT tokens,
                                   authentication information or other sensitive data.
                                """.formatted(
                                teacher.getFirstName()
                                                + " "
                                                + teacher.getLastName(),
                                teacher.getTeacherCode(),
                                teacher.getDepartment()
                                                .getDepartmentName(),
                                academicData,
                                question);

                String answer = chatClient
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();

                AiChatResponse response = AiChatResponse.builder()
                                .question(question)
                                .answer(answer)
                                .build();

                return ApiResponse.<AiChatResponse>builder()
                                .success(true)
                                .message("Teacher AI Response Generated")
                                .data(response)
                                .build();
        }

        private String buildTeacherAcademicContext(
                        List<TeacherSubject> assignments) {

                StringBuilder data = new StringBuilder();

                for (TeacherSubject assignment : assignments) {

                        Subject subject = assignment.getSubject();

                        data.append("\n====================================\n");

                        data.append("SUBJECT CODE: ")
                                        .append(subject.getSubjectCode())
                                        .append("\n");

                        data.append("SUBJECT NAME: ")
                                        .append(subject.getSubjectName())
                                        .append("\n");

                        data.append("CREDITS: ")
                                        .append(subject.getCredits())
                                        .append("\n");

                        data.append("PASSING MARKS: ")
                                        .append(subject.getPassingMarks())
                                        .append("\n");

                        data.append("STUDENT RESULTS:\n");

                        List<Result> results = resultRepository.findAll();

                        for (Result result : results) {

                                if (result.getResultSubjects() == null) {
                                        continue;
                                }

                                for (ResultSubject resultSubject : result.getResultSubjects()) {

                                        if (resultSubject.getSubject() == null) {
                                                continue;
                                        }

                                        if (!resultSubject.getSubject()
                                                        .getId()
                                                        .equals(subject.getId())) {
                                                continue;
                                        }

                                        Student student = result.getStudent();

                                        data.append("- Student: ")
                                                        .append(student.getFirstName())
                                                        .append(" ")
                                                        .append(student.getLastName())
                                                        .append("\n");

                                        data.append("  Roll No: ")
                                                        .append(student.getRollNo())
                                                        .append("\n");

                                        data.append("  Semester: ")
                                                        .append(result.getSemester()
                                                                        .getSemesterName())
                                                        .append("\n");

                                        data.append("  Marks: ")
                                                        .append(resultSubject.getObtainedMarks())
                                                        .append("/")
                                                        .append(resultSubject.getTotalMarks())
                                                        .append("\n");

                                        data.append("  Percentage: ")
                                                        .append(resultSubject.getPercentage())
                                                        .append("\n");

                                        data.append("  Grade: ")
                                                        .append(resultSubject.getGrade())
                                                        .append("\n");

                                        data.append("  Grade Point: ")
                                                        .append(resultSubject.getGradePoint())
                                                        .append("\n");
                                }
                        }
                }

                return data.toString();
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<AiChatResponse> teacherInsights(
                        String username,
                        String question) {

                // Get verified statistics for logged-in teacher
                TeacherAiStatisticsResponse statistics = teacherAiStatisticsService.generateStatistics(username);

                StringBuilder statisticsData = new StringBuilder();

                statisticsData.append("Total Assigned Subjects: ")
                                .append(statistics.getTotalAssignedSubjects())
                                .append("\n");

                statisticsData.append("Total Student Attempts: ")
                                .append(statistics.getTotalStudentAttempts())
                                .append("\n");

                statisticsData.append("Passed Attempts: ")
                                .append(statistics.getPassedAttempts())
                                .append("\n");

                statisticsData.append("Failed Attempts: ")
                                .append(statistics.getFailedAttempts())
                                .append("\n");

                statisticsData.append("Overall Pass Percentage: ")
                                .append(statistics.getPassPercentage())
                                .append("%\n");

                statisticsData.append("Average Marks: ")
                                .append(statistics.getAverageMarks())
                                .append("\n");

                statisticsData.append("Average Percentage: ")
                                .append(statistics.getAveragePercentage())
                                .append("%\n");

                statisticsData.append("\nSUBJECT-WISE STATISTICS:\n");

                statistics.getSubjectStatistics()
                                .forEach(subject -> {

                                        statisticsData.append("\nSubject Code: ")
                                                        .append(subject.getSubjectCode());

                                        statisticsData.append("\nSubject Name: ")
                                                        .append(subject.getSubjectName());

                                        statisticsData.append("\nTotal Attempts: ")
                                                        .append(subject.getTotalAttempts());

                                        statisticsData.append("\nPassed: ")
                                                        .append(subject.getPassedAttempts());

                                        statisticsData.append("\nFailed: ")
                                                        .append(subject.getFailedAttempts());

                                        statisticsData.append("\nPass Percentage: ")
                                                        .append(subject.getPassPercentage())
                                                        .append("%");

                                        statisticsData.append("\nAverage Marks: ")
                                                        .append(subject.getAverageMarks());

                                        statisticsData.append("\nAverage Percentage: ")
                                                        .append(subject.getAveragePercentage())
                                                        .append("%\n");
                                });

                String prompt = """
                                You are an AI Academic Analytics Assistant
                                for a Student Result Management System.

                                You are assisting a teacher.

                                The statistics below were calculated by the
                                application directly from the database.

                                VERIFIED TEACHER STATISTICS:

                                %s

                                TEACHER QUESTION:

                                %s

                                RULES:

                                1. Use only the statistics provided above.
                                2. Do not invent marks, students, subjects,
                                   percentages or statistics.
                                3. Do not change numerical values.
                                4. Give a clear and professional answer.
                                5. Identify weak areas when relevant.
                                6. Provide practical academic recommendations
                                   when appropriate.
                                7. If the requested information is not available,
                                   clearly state that it is not available.

                                Answer the teacher's question directly.
                                """.formatted(
                                statisticsData,
                                question);

                String answer = chatClient
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();

                AiChatResponse response = AiChatResponse.builder()
                                .question(question)
                                .answer(answer)
                                .build();

                return ApiResponse.<AiChatResponse>builder()
                                .success(true)
                                .message("Teacher AI Insights Generated")
                                .data(response)
                                .build();
        }
}