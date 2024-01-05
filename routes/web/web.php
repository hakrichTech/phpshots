<?php

use Phpshots\Router\Route;
use HKMCode\Phpshots\ViewModels\Index\View;
use HKMCode\Phpshots\ViewModels\Index\Event;



Route::add('/', function (){

    $indexViewModel = new View();
   
    $indexEvent = new Event();
    $indexViewModel->setEventConfig($indexEvent);
   
    // $indexViewModel->addEventCallback('beforeRender','__files__',ViewModel::EVENT_PRIORITY_HIGH);
    // $indexViewModel->addEventCallback('afterRender','__closeConnectionMQ',ViewModel::EVENT_PRIORITY_HIGH);
    
    $indexViewModel->setLayout('layout');
    
    $indexViewModel->setContentTemplate('main.pages.index');
    

    echo $indexViewModel;
    
});
