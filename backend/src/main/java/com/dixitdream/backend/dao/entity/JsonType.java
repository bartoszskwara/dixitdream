package com.dixitdream.backend.dao.entity;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Objects;

public abstract class JsonType implements UserType {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public int[] sqlTypes() {
        return new int[] { Types.JAVA_OBJECT };
    }

    @Override
    public boolean equals(Object obj1, Object obj2) throws HibernateException {
        return Objects.equals(obj1, obj2);
    }

    @Override
    public int hashCode(Object obj) throws HibernateException {
        return Objects.hashCode(obj);
    }

    @Override
    public Object nullSafeGet(ResultSet resultSet, String[] strings, SharedSessionContractImplementor sharedSessionContractImplementor, Object o)
            throws HibernateException, SQLException {

        final String cellContent = resultSet.getString(strings[0]);
        if (cellContent == null) {
            return null;
        }

        try {
            return MAPPER.readValue(cellContent.getBytes(StandardCharsets.UTF_8), returnedClass());
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert String to JSON Object: " + e.getMessage(), e);
        }
    }

    @Override
    public void nullSafeSet(PreparedStatement preparedStatement, Object value, int index, SharedSessionContractImplementor sharedSessionContractImplementor)
            throws HibernateException, SQLException {

        if (value == null) {
            preparedStatement.setNull(index, Types.OTHER);
            return;
        }
        try {
            final StringWriter writer = new StringWriter();
            MAPPER.writeValue(writer, value);
            writer.flush();
            preparedStatement.setObject(index, writer.toString(), Types.OTHER);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert " + this.returnedClass().getSimpleName() + " to String: " + e.getMessage(), e);
        }
    }

    @Override
    public Object deepCopy(Object value) throws HibernateException {
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(value);
            oos.flush();
            oos.close();
            bos.close();

            ByteArrayInputStream bais = new ByteArrayInputStream(bos.toByteArray());
            return new ObjectInputStream(bais).readObject();
        } catch (ClassNotFoundException | IOException ex) {
            throw new HibernateException(ex);
        }
    }

    @Override
    public boolean isMutable() {
        return true;
    }

    @Override
    public Serializable disassemble(Object value) throws HibernateException {
        return (Serializable) deepCopy(value);
    }

    @Override
    public Object assemble(Serializable cached, Object owner) throws HibernateException {
        return deepCopy(cached);
    }

    @Override
    public Object replace(Object original, Object target, Object owner) throws HibernateException {
        return deepCopy(original);
    }
}
