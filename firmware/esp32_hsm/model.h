#ifndef AI_MODEL_H
#define AI_MODEL_H

// Default Model (No Anomalies)
// User must run train_model.py to generate real bounds

// Huge bounds to preventing false positives before training
float means[] = { 0, 0, 0, 0 };
float stds[] = { 0, 0, 0, 0 };
float lower_bounds[] = { -99999, -99999, -99999, -99999 };
float upper_bounds[] = { 99999, 99999, 99999, 99999 };

bool isAnomaly(int16_t ax, int16_t ay, int16_t az, int voltage) {
    float input[] = { (float)ax, (float)ay, (float)az, (float)voltage };
    
    // Check bounds
    for (int i = 0; i < 4; i++) {
        if (input[i] < lower_bounds[i] || input[i] > upper_bounds[i]) {
            return true; // Anomaly detected
        }
    }
    return false;
}

#endif
