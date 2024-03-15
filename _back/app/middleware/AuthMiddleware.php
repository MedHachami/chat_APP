<?php

class AuthMiddleware
{
    public static function authenticate()
    {
            $headers = apache_request_headers();
            $token = isset($headers['Authorization']) ? $headers['Authorization'] : null;

        if (!$token) {
            http_response_code(401);
            exit(json_encode(['message' => 'Unauthorized']));
        }

        $decoded = JwtAuth::decodeToken($token);
        

        if (!$decoded) {
            http_response_code(401);
            exit(json_encode(['message' => 'Invalid token']));
        }

        return $decoded;
    }

   
}
