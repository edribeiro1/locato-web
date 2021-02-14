<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Router extends CI_Controller
{
    public function index($id = null)
    {
        $uri = explode('/', strtolower($_SERVER['REQUEST_URI']));
        $action = $uri[count($uri)-1];

        if ($action === 'login' || $action === '') {
            $this->twig->display("login/index");
        } 
        else if ($action === 'dashboard') {
            $this->twig->display("$action/index");
        } 
        else if ($action === 'mapa') {
            $this->twig->display("$action/index");
        }
        else if ($uri[count($uri)-2] == 'relatorios') {
            $this->twig->display("relatorios/$action/index");
        }
        else {
            if (is_numeric($id) && (int)$id > 0) {
                $action = 'form';
                $view = $uri[count($uri)-3];
                $group = $uri[count($uri)-4];

                $this->twig->display("$group/$view/$action", ['id'=>$id]);
            } else {
                if ($action == 'novo') {
                    $action = 'form';
                }
                $view = $uri[count($uri)-2];
                $group = $uri[count($uri)-3];
                $this->twig->display("$group/$view/$action");
            }
        }
    }
}
