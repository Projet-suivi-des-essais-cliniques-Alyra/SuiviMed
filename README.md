# SuiviMed

# Présentation
Ce projet a pour but une prise en charge automatisée du suivi medical de patients au cours d'essais cliniques afin de garantir une inviolabilité des données, limiter/empêcher les fraudes et la corruption ainsi que permettre la mise en place d'un système d'alerte automatique interrompant la poursuite des essais cliniques en cas de dangers pour les personnes participantes.

Voici une liste des bénéfices de l'implémentation de ce système sur la blockchain:

- Amélioration du suivi et interruption automatisée des essais cliniques immédiate pour l'ensemble des patients en cas d'alerte suite à des effets secondaires critiques.
- Notice d'avertissement pour les patients candidats d'un rapport automatiquement généré par le smart contrat sur les tests et les effets secondaires enregistrés au cours de l'essai clinique.
- Limitation ou élimination des fraudes ou falsications par l'enregistrement de la données sur IPFS ainsi que d'un hash sur la blockchain pour vérifier son intégrité. 
- Transparence des études pour les autorités de santé qui ont accès aux données enregistrées au fur et à mesure des essais, et conservation de l'historique des essais cliniques sur la blockchain et dans IPFS.
- Limitation ou suppression des possibilités de corruption ou de biais, en decentralisant le controle du systeme et en contrôlant l'accès des données des participants suivant leur rôle dans le système. 

# Fonctionalités:
Le système est initialisé par un développeur blockchain appelé root qui deploie le contrat pour un client promoteur qui souhaite utiliser le système. Au moment du deploiement, l'adresse d'une autorité de santé doit être fournie. L'adresse du promoteur ainsi que celle de l'autorité seront designée comme les Admins du groupe des promoteurs et du groupe des autorités respectivement. 

Des promoteurs et des autorités peuvent être ajoutés grâce aux fonction "addPromoteurs()" et addAuthorities() accessibles uniquement par les promoteurs admins et autorités admins respectivement.

Le processus est le suivant :

Un promoteur crée un protocol pour un essai clinique. Du point de vue du smart contrat, ce protocol comporte deux parties qui seront cryptées différemmment pour contrôler l'accès de l'information:

- (descriptionCID) une partie est relative à la description de l'étude et donne les méthodes d'investigation ainsi qu'une notice d'avertissement pour les patients qui souhaitent participer aux essais cliniques. Cette partie du document protocole est accessibles à toutes les personnes réunis dans un projet (promoteurs, autorités, investigateurs, patients).
- (treatmentsListCID) l'autre partie est une annexe donnant la liste des numéros de patients et de leur traitements associés (soit le vrai traitement médical qui fait l'objet de l'étude, soit un placebo). Ce document est crypté pour n'être accessible que par les promoteurs et les autorités. Ce document est également stocké sur ipfs ainsi que son hash sur la blockchain.

Ce protocole doit alors être soumis aux autorités pour être validé avant de pouvoir lancer les essais cliniques. Les autorités ont seules accès à la fonction "validateProtocol()" pour effectuer la validation.

Une fois le protocole validé, un projet peut être crée par un promoteur (et éventuellement des associés) en utilisant la fonction "createProject()". Un projet est initié et financé par les promoteurs qui enrollent des investigateurs pour recruter des patients et réaliser les études cliniques. Les investigateurs sont donc enregistrés dans la blockchain ainsi que les patients qu'ils recrutent grâce à la fonction "addPatients()". Leur consentement est recueilli en même temps et enregistré dans la blockchain.

Les investigateurs recueillent l'identité des patients ainsi que leurs données médicales et les enregistrent sur IPFS et les CIDs (nameCID et dataCID resp.) des fichiers sur la blockchain grâce aux fonctions "addPAtient()" et "collectData()". L'association du nom du patient à son numéro de patient est enregistrée dans un document indépendant des données médicales de façon à pouvoir être cryptée par une clé générée par l'investigateur lui-même et assurer la confidentialité des données médicales des patients. Les promoteurs n'ont accès qu'aux données médicales. Les autorités doivent avoir accès aux noms des patients et à leurs données médicales. La clé d'encryption de ses documents doit donc être partagée par les investigateurs avec les autorités. 

Un patient peut révoquer son consentement grâce à la fonction "revokeConsent()" auquel cas il ne pourra plus participer aux essais cliniques.
Par la suite ou au terme de l'étude, un patient peut exiger la destruction de ses données, auquel cas la clef d'encryption de son identité pourra être détruite par la fonction "destroyPatientKey()".

En cas de recueil de données médicales critiques, une alerte sera automatiquement déclenchée et la poursuite des essais cliniques suspendue grâce à la fonction "setAlertOn()" accessible par les investigateurs.

La reprise des essais cliniques peut être décidée par l'accord commun des promoteurs et des autorités grâce à la fonction "resumeAfterAlert()", les promoteurs et autorités devront au préalable soumettre leur accord grâce à la fonction "agreeOnResume()".

En cas de modification du protocole d'un essai clinique, le consentement d'un patient est de nouveau exigé pour pouvoir continuer les essais. Ainsi la fonction "updateProtocol()" retire le consentement des Patients concernés.

# Installation et éxécution
Le contrat sera déployé par un developpeur blockchain de SuiviMed. 


