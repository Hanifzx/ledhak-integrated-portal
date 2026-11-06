<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Forward Vercel serverless function requests to Laravel public/index.php
require __DIR__ . '/../public/index.php';
