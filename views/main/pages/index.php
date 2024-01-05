<?php

use Phpshots\Vote\Activator;


// use HKMCode\Phpshots\PierreLannoy\API\Device;
// use HKMCode\Phpshots\PierreLannoy\Plugin\Feature\AnalyticsIP;

// // $device = Device::get( 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko)' );
// $analytics = AnalyticsIP::get_status_kpi_collection( [ 'site_id' => 1 ] );
// $result    = [];
// 		if ( array_key_exists( 'data', $analytics ) ) {
// 			foreach ( $analytics['data'] as $kpi ) {
// 				$item                = [];
// 				$item['kpi']         = $kpi['name'];
// 				$item['description'] = $kpi['description'];
// 				$item['value']       = $kpi['value']['human'];
// 				if ( array_key_exists( 'ratio', $kpi ) && isset( $kpi['ratio'] ) ) {
// 					$item['ratio'] = $kpi['ratio']['percent'] . '%';
// 				} else {
// 					$item['ratio'] = '-';
// 				}
// 				$item['variation'] = ( 0 < $kpi['variation']['percent'] ? '+' : '' ) . (string) $kpi['variation']['percent'] . '%';
// 				$result[]          = $item;
// 			}
// 		}
// print_r($result);
// print_r(iplocator_describe());
// print_r($device->get_as_array());

helloVote();

Activator::activate();