<?php
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
CLass JwtAuth{
    private static $secretKey = "m2z@Od";

    public static function createToken($data)
    {
        $tokenId    = base64_encode(random_bytes(32));
        $issuedAt   = time();
        $expire     = $issuedAt + 60 * 60;  // Expire in 1 hour
        $issuer     = "HELP_DESK";
        
        $token = [
            'iat'  => $issuedAt,
            'jti'  => $tokenId,
            'iss'  => $issuer,
            'exp'  => $expire,
            'data' => $data
        ];

        return JWT::encode($token, self::$secretKey, 'HS256');
    }

    public static function decodeToken($token)
    {
        try {
            $decoded = JWT::decode($token, new Key(self::$secretKey, 'HS256'));
            return $decoded->data;
        } catch (ExpiredException $e) {
            // Handle expired token
            return null;
        } catch (\Exception $e) {
            // Handle other errors
            return null;
        }
    }
}