package com.example.translatorbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/translate")
@CrossOrigin(origins = "http://localhost:5173")
public class TranslationController {

    @PostMapping("/code")
    public ResponseEntity<?> translateCode(@RequestBody Map<String, String> request) {
        String sourceCode = request.get("code");
        String targetLanguage = request.get("language");

        // Ippo namma security test pandrathukaga oru dummy response anupurom.
        // Adutha step-la idhukulla unmaiyana translation logic ezhudhurom!
        String dummyResponse = "Security Check Passed! Token valid ah irukku. Neenga anupina "
                + targetLanguage + " conversion request success.";

        return ResponseEntity.ok(Map.of("translatedCode", dummyResponse));
    }
}