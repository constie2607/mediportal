package com.consdev.mediportal.dto;
import com.consdev.mediportal.enums.TriageStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class TriageRequestDto {

        private String problem;
        private String duration;
        private String tried;
        private String worried;
        private String helpWanted;
        private String bestTimes;

        //AI symptom checker inputs
        private Integer severity; //1-10
        private Integer durationDays; //numeric version
        private List<String> symptoms;
        private Map<String, Boolean> redFlags;



        //getters&setters


        public String getProblem() {return problem;}
        public void setProblem(String problem) {this.problem = problem;}

        public String getDuration() {return duration;}
        public void setDuration(String duration) {this.duration = duration;}

        public String getTried() {return tried;}
        public void setTried(String tried) {this.tried = tried;}

        public String getWorried() {return worried;}
        public void setWorried(String worried) {this.worried = worried;}

        public String getHelpWanted() {return helpWanted;}
        public void setHelpWanted(String helpWanted) {this.helpWanted = helpWanted;}

        public String getBestTimes() {return bestTimes;}
        public void setBestTimes(String bestTimes) {this.bestTimes = bestTimes;}

        public Integer getSeverity() {return severity;}
        public void setSeverity(Integer severity) {this.severity = severity;}

        public Integer getDurationDays() {return durationDays;}
        public void setDurationDays(Integer durationDays) {this.durationDays = durationDays;}

        public List<String> getSymptoms() {return symptoms;}
        public void setSymptoms(List<String> symptoms) {this.symptoms = symptoms;}

        public Map<String, Boolean> getRedFlags() {return redFlags;}
        public void setRedFlags(Map<String, Boolean> redFlags) {this.redFlags = redFlags;}






}


