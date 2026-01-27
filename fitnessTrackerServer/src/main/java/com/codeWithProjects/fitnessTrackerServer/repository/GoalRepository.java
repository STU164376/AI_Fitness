package com.codeWithProjects.fitnessTrackerServer.repository;

import com.codeWithProjects.fitnessTrackerServer.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

//    @Query("SELECT COUNT(g) FROM Goal g WHERE g.achieved = true")
//    Long countAchievedGoals();

    Long countByAchievedTrue();
//    @Query("SELECT COUNT(g) FROM Goal g WHERE g.achieved = false")
//    Long countNotAchievedGoals();
    Long countByAchievedFalse();
}
