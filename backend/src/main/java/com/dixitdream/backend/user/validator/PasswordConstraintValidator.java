package com.dixitdream.backend.user.validator;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.LengthRule;
import org.passay.PasswordData;
import org.passay.PasswordValidator;
import org.passay.RuleResult;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void initialize(ValidPassword arg0) {
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        PasswordValidator validator = new PasswordValidator(Arrays.asList(
                new LengthRule(8, 30),
                new CharacterRule(EnglishCharacterData.LowerCase, 1),
                new CharacterRule(EnglishCharacterData.UpperCase, 1),
                new CharacterRule(EnglishCharacterData.Special, 1),
                new CharacterRule(EnglishCharacterData.Digit, 1)
        ));

        RuleResult result = validator.validate(new PasswordData(password));
        if (result.isValid()) {
            return true;
        }
        List<String> errors = result.getDetails().stream()
                .flatMap(d -> Arrays.stream(d.getErrorCodes()))
                .collect(Collectors.toList());
        context.disableDefaultConstraintViolation();
        String message;
        try {
            message = objectMapper.writeValueAsString(errors);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            message = "Invalid password";
        }
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
        return false;
    }
}