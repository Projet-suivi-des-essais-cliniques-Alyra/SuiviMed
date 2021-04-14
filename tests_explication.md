# Explications des tests choisis

Dû au temps limité pour le projet, on a essayé d'implémenter les tests les plus intéressants permettant de démontrer 
des aspects importants du fonctionnement du smart contrat.

Par exemple le troisieme test implemente un scenario de test du fonctionnemnt de l'alerte donnee par un investigateur suite a des donnees medicales alarmantes pour un patient.
L'alerte a pour effet d'empecher le recrutement de nouveaux patients sur des essais cliniques lie au meme protocole que le patient, ainsi que d'empecher la poursuite 
des essais cliniques pour les patients experimentant le meme traitement. La reprise des essais cliniques peut etre declenchee par le commun accord du promoteur du projet
et de l'autorite supervisant le projet. Une fois l'accord obtenu, on peut verifier la reprise des essais cliniques.