<?php
/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/06_Customer_Center/10_Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */

require_once 'include/api/SugarApi.php';

class opportunitiesLinkAllListPrice extends SugarApi
{
    /**
     * {@inheritdoc}
     *
     * @return array
     */
    public function registerApiRest()
    {
        return
            array(
                'opportunitiesLinkAllListPrice' => array(
                    'reqType' => 'POST',
                    'path' => array('QS_Promociones', 'listaprecios'),
                    'pathVars' => array('', ''),
                    'jsonParams' => array('idPromocion'),
                    'method' => 'linkAllLists',
                    'shortHelp' => 'Link all list price to QS_Promociones',
                    'longHelp' => '',
                )
            );
    }

    /**
     * Opportunity Override since we have custom logic that needs to be ran
     *
     * {@inheritdoc}
     */
    public function linkAllLists(ServiceBase $api, array $args)
    {
        $GLOBALS['log']->fatal('args :::: '.print_r($args['idPromocion'],1));
        $qsPromocion = BeanFactory::getBean('QS_Promociones',$args['idPromocion']);
        $link = 'qs_promociones_qs01_listasprecio';
        $qsPromocion->load_relationship($link);
        $lp_bean = BeanFactory::newBean('QS01_ListasPrecio');
        $sugarQuery = new SugarQuery();
        $sugarQuery->select(array('id'));
        $sugarQuery->from($lp_bean, array('team_security' => false));
        $res = $sugarQuery->execute();
        if($qsPromocion->id){
            foreach ($res as $idLP) {
                $GLOBALS['log']->fatal('ligando id :::: '.$idLP['id']);
                $GLOBALS['log']->fatal('ligando id :::: '.$qsPromocion->id);
                $qsPromocion->$link->add($idLP['id']);
            }
        }
        return true;
    }
}
