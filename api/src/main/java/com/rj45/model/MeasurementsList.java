package com.rj45.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MeasurementsList implements UserType<List<Measurement>> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public int getSqlType() {
        return Types.OTHER;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Class<List<Measurement>> returnedClass() {
        return (Class<List<Measurement>>) (Class<?>) List.class;
    }

    @Override
    public boolean equals(List<Measurement> x, List<Measurement> y) {
        return x == null ? y == null : x.equals(y);
    }

    @Override
    public int hashCode(List<Measurement> x) {
        return x == null ? 0 : x.hashCode();
    }

    @Override
    public List<Measurement> nullSafeGet(ResultSet rs, int position, SharedSessionContractImplementor session, Object owner) throws SQLException {
        Array array = rs.getArray(position);
        if (array == null) {
            return null;
        }

        Object[] jsonbArray = (Object[]) array.getArray();
        List<Measurement> result = new ArrayList<>();

        for (Object jsonb : jsonbArray) {
            try {
                result.add(objectMapper.readValue(jsonb.toString(), Measurement.class));
            } catch (JsonProcessingException e) {
                throw new HibernateException("Error deserializing JSONB", e);
            }
        }

        return result;
    }

    @Override
    public void nullSafeSet(PreparedStatement st, List<Measurement> value, int index, SharedSessionContractImplementor session) throws SQLException {
        if (value == null) {
            st.setNull(index, Types.ARRAY);
            return;
        }

        try {
            String[] jsonbArray = value.stream()
                    .map(measurement -> {
                        try {
                            return objectMapper.writeValueAsString(measurement);
                        } catch (JsonProcessingException e) {
                            throw new HibernateException("Error serializing Measurement to JSONB", e);
                        }
                    })
                    .toArray(String[]::new);

            Array array = session.getJdbcConnectionAccess().obtainConnection().createArrayOf("jsonb", jsonbArray);
            st.setArray(index, array);
        } catch (Exception e) {
            throw new HibernateException("Error setting JSONB array parameter", e);
        }
    }

    @Override
    public List<Measurement> deepCopy(List<Measurement> value) {
        if (value == null) {
            return null;
        }
        List<Measurement> copy = new ArrayList<>(value.size());
        for (Measurement measurement : value) {
            copy.add(new Measurement(measurement.getAccel(), measurement.getGyro()));
        }
        return copy;
    }

    @Override
    public boolean isMutable() {
        return true;
    }

    @Override
    public Serializable disassemble(List<Measurement> value) {
        return (Serializable) deepCopy(value);
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Measurement> assemble(Serializable cached, Object owner) {
        return deepCopy((List<Measurement>) cached);
    }

    @Override
    public List<Measurement> replace(List<Measurement> detached, List<Measurement> managed, Object owner) {
        return deepCopy(detached);
    }
}