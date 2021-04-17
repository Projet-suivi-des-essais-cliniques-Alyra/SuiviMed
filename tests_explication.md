# Explications des tests choisis

Dû au temps limité pour le projet, on a essayé d'implémenter les tests les plus intéressants permettant de démontrer 
des aspects importants du fonctionnement du smart contrat.

Par exemple le troisième test implémente un scénario de test du fonctionnemnt de l'alerte donnée par un investigateur suite à des données médicales alarmantes pour un patient.
L'alerte a pour effet d'empêcher le recrutement de nouveaux patients sur des essais cliniques lié au même protocole que le patient, ainsi que d'empêcher la poursuite 
des essais cliniques pour les patients experimentant le même traitement. La reprise des essais cliniques peut être declenchée par le commun accord du promoteur du projet
et de l'autorité supervisant le projet. Une fois l'accord obtenu, on peut vérifier la reprise des essais cliniques.