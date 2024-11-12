package com.rj45.model;
import jakarta.persistence.*;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    private String natID;
    private String email;
    private boolean discharged;

    public Patient() {
    }

    public Patient(long id, String name, String natID, String email) {
        this.id = id;
        this.name = name;
        this.natID = natID;
        this.email = email;
        this.discharged = false;

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNatID() {
        return natID;
    }

    public void setNatID(String natID) {
        this.natID = natID;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean getStatus(){

        return discharged;
    }

    public void setStatus(boolean status){

        this.discharged = status;
    }
}
