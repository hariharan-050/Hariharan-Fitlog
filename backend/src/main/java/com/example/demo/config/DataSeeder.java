
package com.example.demo.config;

import com.example.demo.entity.SystemAccount;
import com.example.demo.entity.WorkoutRoutine;
import com.example.demo.repository.SystemAccountRepository;
import com.example.demo.repository.WorkoutRoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemAccountRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private WorkoutRoutineRepository workoutRoutineRepository;

    public DataSeeder(SystemAccountRepository repository,
                      PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        SystemAccount admin = null;
        if (!repository.existsByUsername("admin_core")) {

            admin = new SystemAccount();
            admin.setUsername("admin_core");
            admin.setEmail("admin@demo.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_PLATFORM_COORDINATOR");

            admin = repository.save(admin);
        } else {
            admin = repository.findByUsername("admin_core").orElse(null);
        }

        if (!repository.existsByUsername("member_core")) {
            SystemAccount member = new SystemAccount();
            member.setUsername("member_core");
            member.setEmail("member@demo.com");
            member.setPassword(passwordEncoder.encode("member123"));
            member.setRole("ROLE_MEMBER");
            repository.save(member);
        }

        if (!repository.existsByUsername("user_core")) {
            SystemAccount userAcc = new SystemAccount();
            userAcc.setUsername("user_core");
            userAcc.setEmail("user@demo.com");
            userAcc.setPassword(passwordEncoder.encode("user123"));
            userAcc.setRole("ROLE_USER");
            repository.save(userAcc);
        }

        if (workoutRoutineRepository != null && workoutRoutineRepository.count() == 0 && admin != null) {
            WorkoutRoutine routine1 = new WorkoutRoutine();
            routine1.setTitle("Hypertrophy Core Blueprint");
            routine1.setDescription("Upper/Lower split focused on progressive overload and cadence monitoring.");
            routine1.setDifficultyLevel("INTERMEDIATE");
            routine1.setTargetGoal("HYPERTROPHY");
            routine1.setPublic(true);
            routine1.setAuthor(admin);
            workoutRoutineRepository.save(routine1);

            WorkoutRoutine routine2 = new WorkoutRoutine();
            routine2.setTitle("Powerlifting Foundation");
            routine2.setDescription("Compound movements emphasizing barbell biomechanics and central nervous system recruitment.");
            routine2.setDifficultyLevel("ADVANCED");
            routine2.setTargetGoal("STRENGTH");
            routine2.setPublic(true);
            routine2.setAuthor(admin);
            workoutRoutineRepository.save(routine2);
        }
    }
}