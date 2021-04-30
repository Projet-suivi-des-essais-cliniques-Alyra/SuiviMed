# Explications des tests choisis

Dû au temps limité pour le projet, on a essayé d'implémenter les tests les plus intéressants permettant de démontrer 
des aspects importants du fonctionnement du smart contrat.

- Le premier test est banal et vérifie l'accessibilité et le bon fonctionnement de la fonction addPromoter(), qui permet à l'Admin des promoteurs d'ajouter de nouveaux promoteurs.

- Le deuxième test vérifie le bon fonctionnement de la fonction addPatients(), réservée aux investigateurs qui recrutent de nouveaux patients pour les essais medicaux d'un protocol. Pour cela un promoteur crée un protocle, l'autorité le valide puis le promoteur peut lancer un projet en recrutant un premier investigateur pour effectuer les essais cliniques du protocol. Celui-ci peut alors ajouter des patients. On vérifie que des utilisateurs non investigateurs ne peuvent ajouter de patients et que l'on ne peut pas ajouter plusieurs fois le même patient ...

- Le troisième test implémente un scénario de test du fonctionnemnt de l'alerte donnée par un investigateur suite à des données médicales alarmantes pour un patient.
L'alerte a pour effet d'empêcher le recrutement de nouveaux patients sur des essais cliniques lié au même protocole que le patient, ainsi que d'empêcher la poursuite 
des essais cliniques pour les patients experimentant le même traitement. La reprise des essais cliniques peut être declenchée par le commun accord du promoteur du projet
et de l'autorité supervisant le projet. Une fois l'accord obtenu, on peut vérifier la reprise des essais cliniques. Ces differents points sont verifiés dans ce scénario.

- Le quatrième test vérifie le bon fonctionnement de la fonction updateProtocol() qui nécessite un nouveau recueil du consentement des patients participants aux essais cliniques. Deux patients sont ajoutés. On vérifie que leur consentement est positif avant la mise à jour du protocol. Puis on effectue la mise à jour du protocol. On vérifie ensuite que le consentement des patients a été invalidé et doit être de nouveau donné par ces derniers pour pouvoir reprendre les essais cliniques. On verifie alors qu'un patient peut redonner son consentement apres la mise a jour du protocol avec la fonction consent().

- le cinquième test est dédié à la vérification du bon fonctionnement du recueil du consentement d'un patient lors de son recrutement et de la fonction revokeConsent() qui lui permet de révoquer son consentement. Dans ce scénario, un patient qui vient d'etre ajouté révoque son consentement. On vérifie que le système a bien enregistré sa révocation et que son investigateur ne peut plus ajouter de données médicales à son dossier.


# Verification des tests

(base) bruno@bruno-Yoga:~/Documents/Alyra/projet final/BC_et_essais_cliniques/SuiviMed$ truffle test ./test/testsSuiviMed.js --network Ganache
Using network 'Ganache'.


Compiling your contracts...
===========================
> Compiling ./contracts/SuiviMed.sol
> Artifacts written to /tmp/test--13320-zVQwRFiivggD
> Compiled successfully using:
   - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang



  Contract: SuiviMed
    ✓ Test verifies proper access to addPromoter function (1448ms)
    ✓ Test verifies proper functionning of addPatient function (1066ms)
    ✓ Scenario verifying the functionning of alert on protocol (1267ms)
    ✓ Scenario verifying consents of patients is revoked when protocol is updated (690ms)
    ✓ Scenario verifying data of patients, whose consent were revoked, cannot be collected anymore (433ms)


  5 passing (7s)

