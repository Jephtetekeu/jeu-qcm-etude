const SUBJECTS = {
  informatique: {
    label: "Informatique",
    icon: "💻",
    color: "#4f46e5",
    categories: [

      // ─────────────────────────────────────────
      //  1. RÉSEAUX
      // ─────────────────────────────────────────
      {
        name: "Réseaux",
        questions: [
          {
            question: "Quelle est la couche du modèle OSI responsable du routage des paquets ?",
            choices: ["Couche Transport", "Couche Réseau", "Couche Liaison", "Couche Application"],
            correct: 1,
            explanation: "La couche 3 (Réseau) gère l'adressage logique et le routage des paquets entre réseaux différents."
          },
          {
            question: "Quel protocole est utilisé pour attribuer automatiquement des adresses IP ?",
            choices: ["DNS", "FTP", "DHCP", "HTTP"],
            correct: 2,
            explanation: "DHCP (Dynamic Host Configuration Protocol) attribue automatiquement des adresses IP aux machines d'un réseau."
          },
          {
            question: "Quelle est la plage d'adresses IP privées de classe A ?",
            choices: ["172.16.0.0 – 172.31.255.255", "192.168.0.0 – 192.168.255.255", "10.0.0.0 – 10.255.255.255", "127.0.0.0 – 127.255.255.255"],
            correct: 2,
            explanation: "La plage 10.0.0.0/8 correspond aux adresses privées de classe A définie par la RFC 1918."
          },
          {
            question: "Quel port utilise le protocole HTTPS par défaut ?",
            choices: ["80", "21", "443", "8080"],
            correct: 2,
            explanation: "HTTPS utilise le port 443 par défaut, tandis que HTTP utilise le port 80."
          },
          {
            question: "Qu'est-ce qu'un sous-réseau (subnet) ?",
            choices: ["Une subdivision logique d'un réseau IP", "Un protocole de communication", "Un type de câble réseau", "Un serveur de fichiers"],
            correct: 0,
            explanation: "Un sous-réseau est une subdivision logique d'un réseau IP qui permet d'organiser et de segmenter le trafic."
          },
          {
            question: "Quel modèle réseau comporte 4 couches (Application, Transport, Internet, Accès réseau) ?",
            choices: ["Modèle OSI", "Modèle TCP/IP", "Modèle IEEE 802", "Modèle X.25"],
            correct: 1,
            explanation: "Le modèle TCP/IP (DoD) comporte 4 couches, contrairement au modèle OSI qui en compte 7."
          },
          {
            question: "Quelle est la différence principale entre TCP et UDP ?",
            choices: [
              "TCP est plus rapide qu'UDP",
              "UDP est fiable et TCP ne l'est pas",
              "TCP garantit la livraison des paquets, UDP ne le garantit pas",
              "UDP est uniquement utilisé pour les emails"
            ],
            correct: 2,
            explanation: "TCP est orienté connexion et garantit la livraison ordonnée des paquets. UDP est sans connexion et n'offre aucune garantie de livraison."
          },
          {
            question: "Qu'est-ce que la translation d'adresse réseau (NAT) ?",
            choices: [
              "Un protocole de routage dynamique",
              "Une technique qui mappe des adresses IP privées vers une adresse publique",
              "Un type de pare-feu",
              "Un protocole de chiffrement réseau"
            ],
            correct: 1,
            explanation: "Le NAT permet à plusieurs machines d'un réseau privé de partager une ou plusieurs adresses IP publiques pour accéder à Internet."
          },
          {
            question: "Quel protocole résoudre un nom de domaine en adresse IP ?",
            choices: ["FTP", "SMTP", "DNS", "SNMP"],
            correct: 2,
            explanation: "Le DNS (Domain Name System) traduit les noms de domaine lisibles (ex: google.com) en adresses IP numériques."
          },
          {
            question: "Qu'est-ce qu'un VPN ?",
            choices: [
              "Un virus de réseau privé",
              "Un réseau privé virtuel qui sécurise et chiffre la connexion Internet",
              "Un protocole de transfert de fichiers",
              "Un type de commutateur réseau"
            ],
            correct: 1,
            explanation: "Un VPN (Virtual Private Network) crée un tunnel chiffré entre l'utilisateur et un serveur, masquant l'adresse IP et sécurisant les données."
          },
          {
            question: "Quelle technologie sans fil opère sur les fréquences 2,4 GHz et 5 GHz ?",
            choices: ["Bluetooth", "Wi-Fi (IEEE 802.11)", "4G LTE", "Zigbee"],
            correct: 1,
            explanation: "Le Wi-Fi (standard IEEE 802.11) utilise les bandes de fréquences 2,4 GHz et 5 GHz (voire 6 GHz pour Wi-Fi 6E)."
          },
          {
            question: "Que signifie l'acronyme ICMP ?",
            choices: [
              "Internet Control Message Protocol",
              "Internal Computer Message Protocol",
              "Integrated Circuit Management Protocol",
              "Internet Communication Module Protocol"
            ],
            correct: 0,
            explanation: "ICMP est utilisé pour envoyer des messages de diagnostic réseau, comme les requêtes ping."
          },
          {
            question: "Combien de bits contient une adresse IPv6 ?",
            choices: ["32 bits", "64 bits", "128 bits", "256 bits"],
            correct: 2,
            explanation: "Une adresse IPv6 est codée sur 128 bits, contre 32 bits pour IPv4, ce qui offre un espace d'adressage considérablement plus grand."
          },
          {
            question: "Quel protocole est utilisé pour envoyer des emails ?",
            choices: ["IMAP", "POP3", "SMTP", "FTP"],
            correct: 2,
            explanation: "SMTP (Simple Mail Transfer Protocol) est utilisé pour l'envoi d'emails. IMAP et POP3 sont utilisés pour la réception."
          },
          {
            question: "Qu'est-ce que la bande passante dans un réseau ?",
            choices: [
              "La distance maximale d'un câble réseau",
              "Le nombre d'appareils connectés simultanément",
              "La quantité de données pouvant être transmises par unité de temps",
              "La latence d'un réseau"
            ],
            correct: 2,
            explanation: "La bande passante représente la capacité maximale de transmission d'un réseau, généralement exprimée en bits par seconde (bps, Mbps, Gbps)."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  2. ALGORITHMES & STRUCTURES DE DONNÉES
      // ─────────────────────────────────────────
      {
        name: "Algorithmes & Structures de données",
        questions: [
          {
            question: "Quelle est la complexité temporelle dans le pire cas de l'algorithme Quick Sort ?",
            choices: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correct: 2,
            explanation: "Dans le pire cas (tableau déjà trié avec un mauvais pivot), Quick Sort atteint O(n²). Sa complexité moyenne est O(n log n)."
          },
          {
            question: "Quelle structure de données fonctionne selon le principe LIFO ?",
            choices: ["File (Queue)", "Tableau", "Pile (Stack)", "Liste chaînée"],
            correct: 2,
            explanation: "La pile (Stack) suit le principe LIFO : Last In, First Out — le dernier entré est le premier sorti."
          },
          {
            question: "Quel algorithme de recherche nécessite que le tableau soit préalablement trié ?",
            choices: ["Recherche linéaire", "Recherche dichotomique (binaire)", "Recherche hash", "Recherche séquentielle"],
            correct: 1,
            explanation: "La recherche dichotomique divise l'espace de recherche en deux à chaque étape et nécessite obligatoirement un tableau trié."
          },
          {
            question: "Quelle est la complexité de la recherche dans une table de hachage en cas moyen ?",
            choices: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
            correct: 3,
            explanation: "En cas moyen, la recherche dans une table de hachage est O(1) — temps constant, indépendant de la taille."
          },
          {
            question: "Qu'est-ce que la récursivité ?",
            choices: ["Une boucle qui s'exécute à l'infini", "Une fonction qui s'appelle elle-même avec un cas de base", "Un tri de données", "Un algorithme de chiffrement"],
            correct: 1,
            explanation: "La récursivité est une technique où une fonction s'appelle elle-même. Le cas de base arrête les appels récursifs et évite la boucle infinie."
          },
          {
            question: "Quelle structure de données est utilisée pour implémenter une file de priorité ?",
            choices: ["Pile", "Tableau trié", "Tas (Heap)", "Graphe"],
            correct: 2,
            explanation: "Un tas (Heap) est une structure d'arbre binaire qui permet d'implémenter efficacement une file de priorité avec des opérations en O(log n)."
          },
          {
            question: "Quelle est la complexité du tri par insertion dans le meilleur cas ?",
            choices: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
            correct: 2,
            explanation: "Dans le meilleur cas (tableau déjà trié), le tri par insertion est O(n) car il ne fait qu'une comparaison par élément."
          },
          {
            question: "Qu'est-ce qu'un graphe orienté acyclique (DAG) ?",
            choices: [
              "Un graphe sans sommets",
              "Un graphe où toutes les arêtes vont dans le même sens et sans cycle",
              "Un graphe avec uniquement des cycles",
              "Un graphe non connecté"
            ],
            correct: 1,
            explanation: "Un DAG (Directed Acyclic Graph) est un graphe orienté sans cycle. Il est utilisé notamment pour représenter des dépendances de tâches."
          },
          {
            question: "Quelle est la différence entre DFS et BFS ?",
            choices: [
              "DFS utilise une file, BFS utilise une pile",
              "DFS explore en profondeur d'abord, BFS explore en largeur d'abord",
              "BFS est plus rapide que DFS dans tous les cas",
              "DFS ne peut pas trouver le chemin le plus court"
            ],
            correct: 1,
            explanation: "DFS (Depth-First Search) plonge le plus loin possible avant de revenir. BFS (Breadth-First Search) explore tous les voisins couche par couche."
          },
          {
            question: "Quelle est la complexité spatiale d'un arbre binaire de recherche équilibré à n nœuds ?",
            choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation: "Un arbre binaire de recherche stocke n nœuds, donc sa complexité spatiale est O(n)."
          },
          {
            question: "Qu'est-ce que la notation Big O ?",
            choices: [
              "Un langage de programmation orienté objet",
              "Une mesure de la performance d'un algorithme en fonction de la taille de l'entrée",
              "Un algorithme de tri",
              "Un protocole réseau"
            ],
            correct: 1,
            explanation: "La notation Big O décrit la complexité (temps ou espace) d'un algorithme dans le pire cas en fonction de la taille n de l'entrée."
          },
          {
            question: "Quel algorithme de tri est basé sur la division récursive du tableau en deux moitiés ?",
            choices: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
            correct: 2,
            explanation: "Merge Sort divise récursivement le tableau en deux moitiés, trie chacune, puis les fusionne. Sa complexité est O(n log n) dans tous les cas."
          },
          {
            question: "Qu'est-ce qu'une liste doublement chaînée ?",
            choices: [
              "Une liste avec deux listes séparées",
              "Une liste où chaque nœud pointe vers le suivant ET le précédent",
              "Une liste triée en ordre croissant et décroissant",
              "Une liste avec des doublons"
            ],
            correct: 1,
            explanation: "Dans une liste doublement chaînée, chaque nœud contient une référence vers le nœud suivant et vers le nœud précédent, permettant la traversée dans les deux sens."
          },
          {
            question: "Qu'est-ce que la programmation dynamique ?",
            choices: [
              "Un paradigme qui utilise des variables dynamiques",
              "Une technique qui décompose un problème en sous-problèmes et mémorise les résultats déjà calculés",
              "Une façon de programmer des animations",
              "Un type de compilation à la volée"
            ],
            correct: 1,
            explanation: "La programmation dynamique résout des problèmes en mémorisant les résultats des sous-problèmes (mémoïsation ou tabulation) pour éviter les calculs redondants."
          },
          {
            question: "Dans un arbre binaire de recherche (ABR), où se trouvent les valeurs inférieures à la racine ?",
            choices: ["À droite", "À gauche", "En haut", "Au centre"],
            correct: 1,
            explanation: "Dans un ABR, toutes les valeurs inférieures à la racine sont dans le sous-arbre gauche, et les supérieures dans le sous-arbre droit."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  3. BASES DE DONNÉES
      // ─────────────────────────────────────────
      {
        name: "Bases de données",
        questions: [
          {
            question: "Quelle commande SQL permet d'extraire des données d'une table ?",
            choices: ["INSERT", "UPDATE", "SELECT", "DELETE"],
            correct: 2,
            explanation: "La commande SELECT est utilisée pour interroger et extraire des données d'une base de données relationnelle."
          },
          {
            question: "Qu'est-ce qu'une clé primaire dans une base de données relationnelle ?",
            choices: ["Un mot de passe pour accéder à la base", "Un identifiant unique pour chaque enregistrement", "Une colonne obligatoire dans chaque table", "Un index sur plusieurs colonnes"],
            correct: 1,
            explanation: "La clé primaire identifie de manière unique chaque enregistrement d'une table — elle ne peut pas être NULL ni dupliquée."
          },
          {
            question: "Quelle clause SQL permet de filtrer les résultats avant agrégation ?",
            choices: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
            correct: 2,
            explanation: "La clause WHERE filtre les lignes avant l'agrégation. HAVING filtre après un GROUP BY."
          },
          {
            question: "Qu'est-ce qu'une jointure (JOIN) en SQL ?",
            choices: ["Une opération pour copier une table", "Une façon de combiner des lignes de deux tables ou plus selon une condition", "Un type d'index", "Une contrainte d'intégrité"],
            correct: 1,
            explanation: "JOIN combine des lignes de deux tables ou plus selon une condition de relation entre elles (généralement basée sur une clé étrangère)."
          },
          {
            question: "Quelle est la différence entre DELETE et TRUNCATE en SQL ?",
            choices: ["DELETE supprime la table, TRUNCATE supprime les données", "Aucune différence", "DELETE supprime ligne par ligne (rollback possible), TRUNCATE vide tout en une opération", "TRUNCATE supprime les colonnes"],
            correct: 2,
            explanation: "DELETE supprime ligne par ligne et peut être annulé (rollback). TRUNCATE supprime toutes les données rapidement et ne peut généralement pas être annulé."
          },
          {
            question: "Qu'est-ce qu'une clé étrangère (foreign key) ?",
            choices: [
              "Une clé utilisée pour chiffrer la base de données",
              "Une colonne qui référence la clé primaire d'une autre table pour établir une relation",
              "Une clé d'accès depuis un pays étranger",
              "Un index secondaire"
            ],
            correct: 1,
            explanation: "Une clé étrangère est une colonne (ou ensemble de colonnes) qui référence la clé primaire d'une autre table, garantissant l'intégrité référentielle."
          },
          {
            question: "Que signifie ACID dans le contexte des bases de données ?",
            choices: [
              "Atomicité, Cohérence, Isolation, Durabilité",
              "Association, Création, Indexation, Duplication",
              "Automatique, Contrôlé, Intégré, Distribué",
              "Accès, Connexion, Intégrité, Data"
            ],
            correct: 0,
            explanation: "ACID garantit la fiabilité des transactions : Atomicité (tout ou rien), Cohérence (état valide), Isolation (transactions indépendantes), Durabilité (données persistées)."
          },
          {
            question: "Quelle est la différence entre une base de données relationnelle et NoSQL ?",
            choices: [
              "Les bases NoSQL sont plus rapides dans tous les cas",
              "Les bases relationnelles utilisent des tables SQL, les NoSQL utilisent divers formats (documents, clé-valeur, graphes…)",
              "NoSQL ne peut pas stocker des données structurées",
              "Les bases relationnelles ne supportent pas les transactions"
            ],
            correct: 1,
            explanation: "Les BDD relationnelles (MySQL, PostgreSQL) structurent les données en tables avec des schémas fixes. Les NoSQL (MongoDB, Redis, Cassandra) offrent plus de flexibilité avec différents modèles de stockage."
          },
          {
            question: "Qu'est-ce qu'un index dans une base de données ?",
            choices: [
              "Une liste alphabétique de toutes les tables",
              "Une structure de données qui accélère les recherches sur une ou plusieurs colonnes",
              "Un résumé du contenu de la base",
              "Un type de jointure"
            ],
            correct: 1,
            explanation: "Un index est une structure (souvent un B-tree) qui permet de localiser rapidement des enregistrements sans parcourir toute la table, au prix d'un espace disque supplémentaire."
          },
          {
            question: "Qu'est-ce que la normalisation d'une base de données ?",
            choices: [
              "La conversion de toutes les valeurs en minuscules",
              "Un processus d'organisation des données pour réduire la redondance et améliorer l'intégrité",
              "La compression des données",
              "La suppression des tables inutilisées"
            ],
            correct: 1,
            explanation: "La normalisation organise les données en appliquant des formes normales (1NF, 2NF, 3NF…) pour éliminer les redondances et les anomalies de mise à jour."
          },
          {
            question: "Quelle commande SQL permet de modifier des données existantes ?",
            choices: ["INSERT", "ALTER", "UPDATE", "MODIFY"],
            correct: 2,
            explanation: "La commande UPDATE modifie les valeurs des colonnes d'enregistrements existants. INSERT ajoute de nouveaux enregistrements."
          },
          {
            question: "Qu'est-ce qu'une vue (VIEW) en SQL ?",
            choices: [
              "Une copie physique d'une table",
              "Une requête SELECT sauvegardée et utilisable comme une table virtuelle",
              "Un type d'index",
              "Un rapport généré automatiquement"
            ],
            correct: 1,
            explanation: "Une vue est une requête SELECT stockée sous un nom. Elle se comporte comme une table virtuelle et simplifie les requêtes complexes sans dupliquer les données."
          },
          {
            question: "Quel type de JOIN retourne uniquement les lignes qui ont une correspondance dans les deux tables ?",
            choices: ["LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN"],
            correct: 3,
            explanation: "INNER JOIN retourne seulement les lignes qui ont une correspondance dans les deux tables. Les LEFT/RIGHT JOIN incluent aussi les lignes sans correspondance d'un côté."
          },
          {
            question: "Qu'est-ce qu'un trigger (déclencheur) en base de données ?",
            choices: [
              "Un bouton dans l'interface d'administration",
              "Une procédure qui s'exécute automatiquement en réponse à un événement (INSERT, UPDATE, DELETE)",
              "Un type de contrainte d'intégrité",
              "Une commande pour sauvegarder la base"
            ],
            correct: 1,
            explanation: "Un trigger est un bloc de code qui s'exécute automatiquement avant ou après un événement DML (INSERT, UPDATE, DELETE) sur une table."
          },
          {
            question: "Qu'est-ce que le sharding dans les bases de données ?",
            choices: [
              "Une technique de chiffrement",
              "La division d'une base de données en plusieurs partitions réparties sur plusieurs serveurs",
              "Un type de sauvegarde incrémentale",
              "Un algorithme de tri des données"
            ],
            correct: 1,
            explanation: "Le sharding partitionne horizontalement les données sur plusieurs serveurs pour améliorer la scalabilité et les performances des bases de données à très grande échelle."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  4. PROGRAMMATION
      // ─────────────────────────────────────────
      {
        name: "Programmation",
        questions: [
          {
            question: "Qu'est-ce que la programmation orientée objet (POO) ?",
            choices: ["Un paradigme basé sur des fonctions mathématiques", "Un paradigme basé sur des objets qui regroupent données et comportements", "Un langage de programmation", "Un type de base de données"],
            correct: 1,
            explanation: "La POO organise le code en objets qui encapsulent des données (attributs) et des comportements (méthodes). Les 4 piliers : encapsulation, héritage, polymorphisme, abstraction."
          },
          {
            question: "Quel mot-clé Python est utilisé pour définir une fonction ?",
            choices: ["function", "def", "func", "define"],
            correct: 1,
            explanation: "En Python, 'def' est utilisé pour déclarer une fonction : def ma_fonction(params):"
          },
          {
            question: "Qu'est-ce qu'un pointeur en langage C ?",
            choices: ["Une variable qui stocke une valeur entière", "Une variable qui stocke l'adresse mémoire d'une autre variable", "Une structure de données", "Un type de boucle"],
            correct: 1,
            explanation: "Un pointeur est une variable qui contient l'adresse mémoire d'une autre variable, permettant une gestion directe de la mémoire."
          },
          {
            question: "Quelle est la différence entre == et === en JavaScript ?",
            choices: ["Aucune différence", "=== compare aussi le type, == fait une conversion de type", "== compare aussi le type", "=== est uniquement pour les chaînes"],
            correct: 1,
            explanation: "=== (égalité stricte) compare la valeur ET le type sans conversion. == peut convertir les types avant de comparer (ex: '5' == 5 est vrai, '5' === 5 est faux)."
          },
          {
            question: "Qu'est-ce qu'une API REST ?",
            choices: ["Un langage de programmation", "Un type de base de données", "Une interface qui permet la communication entre systèmes via HTTP", "Un protocole de chiffrement"],
            correct: 2,
            explanation: "Une API REST utilise les verbes HTTP (GET, POST, PUT, DELETE) pour permettre la communication entre systèmes de manière stateless."
          },
          {
            question: "Qu'est-ce que le polymorphisme en POO ?",
            choices: [
              "La capacité d'un objet à changer de type",
              "La capacité de plusieurs classes à implémenter la même interface ou méthode de façon différente",
              "L'héritage multiple",
              "La copie d'un objet"
            ],
            correct: 1,
            explanation: "Le polymorphisme permet à des objets de classes différentes d'être traités via une interface commune, chacun répondant à sa propre façon à un même appel de méthode."
          },
          {
            question: "Qu'est-ce qu'une exception en programmation ?",
            choices: [
              "Une variable globale",
              "Un événement anormal qui interrompt le flux normal du programme",
              "Une fonction sans paramètre",
              "Un type de boucle spéciale"
            ],
            correct: 1,
            explanation: "Une exception est un événement inattendu (erreur réseau, division par zéro…) qui interrompt le flux normal. Elle peut être capturée avec try/catch pour être gérée."
          },
          {
            question: "Qu'est-ce que la programmation fonctionnelle ?",
            choices: [
              "Un paradigme qui utilise des fonctions mathématiques pures sans effets de bord",
              "La programmation de fonctions Windows",
              "Un paradigme orienté objets",
              "La programmation de fonctions réseau"
            ],
            correct: 0,
            explanation: "La programmation fonctionnelle utilise des fonctions pures (même entrée → même sortie, sans effets de bord), l'immuabilité et des fonctions d'ordre supérieur."
          },
          {
            question: "Que fait le mot-clé 'static' dans une méthode de classe en Java ?",
            choices: [
              "Rend la méthode privée",
              "La méthode appartient à la classe elle-même, pas à une instance",
              "Empêche la méthode d'être héritée",
              "Rend la méthode plus rapide"
            ],
            correct: 1,
            explanation: "Une méthode 'static' appartient à la classe et non à une instance. On peut l'appeler directement via le nom de la classe sans créer d'objet."
          },
          {
            question: "Qu'est-ce que Git ?",
            choices: [
              "Un langage de programmation",
              "Un système de gestion de versions distribué",
              "Un IDE (environnement de développement)",
              "Un framework web"
            ],
            correct: 1,
            explanation: "Git est un système de contrôle de versions distribué qui permet de suivre les modifications du code, de collaborer et de gérer différentes branches de développement."
          },
          {
            question: "Qu'est-ce qu'un design pattern (patron de conception) ?",
            choices: [
              "Un modèle graphique pour les interfaces",
              "Une solution réutilisable à un problème courant de conception logicielle",
              "Un framework de test",
              "Un type de base de données"
            ],
            correct: 1,
            explanation: "Les design patterns sont des solutions éprouvées et réutilisables à des problèmes récurrents de conception. Exemples : Singleton, Observer, Factory, MVC."
          },
          {
            question: "Qu'est-ce que l'héritage en POO ?",
            choices: [
              "La copie d'une variable dans une autre",
              "La capacité d'une classe à hériter des attributs et méthodes d'une classe parente",
              "La suppression d'une classe",
              "L'importation d'une bibliothèque"
            ],
            correct: 1,
            explanation: "L'héritage permet à une classe enfant de réutiliser les attributs et méthodes de la classe parente, favorisant la réutilisation du code et la hiérarchie des classes."
          },
          {
            question: "Qu'est-ce qu'un garbage collector (ramasse-miettes) ?",
            choices: [
              "Un outil de nettoyage de fichiers inutiles",
              "Un mécanisme automatique de gestion de la mémoire qui libère les objets non utilisés",
              "Un outil d'analyse de code",
              "Un processus de compression de données"
            ],
            correct: 1,
            explanation: "Le garbage collector libère automatiquement la mémoire occupée par des objets qui ne sont plus référencés, évitant les fuites mémoire (utilisé en Java, Python, C#…)."
          },
          {
            question: "Que signifie le principe DRY en développement logiciel ?",
            choices: [
              "Développement Rapide Yolo",
              "Don't Repeat Yourself — éviter la duplication de code",
              "Design Responsive Yesterday",
              "Data Relational Yield"
            ],
            correct: 1,
            explanation: "DRY (Don't Repeat Yourself) est un principe qui prône l'élimination des duplications de code. Chaque logique doit avoir une représentation unique dans le système."
          },
          {
            question: "Qu'est-ce que l'encapsulation en POO ?",
            choices: [
              "La compression des données",
              "Le regroupement des données et méthodes dans une classe avec contrôle d'accès",
              "La création de copies d'objets",
              "La suppression des attributs inutilisés"
            ],
            correct: 1,
            explanation: "L'encapsulation regroupe données et méthodes dans une classe et contrôle leur accessibilité via des modificateurs (public, private, protected) pour protéger l'intégrité des données."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  5. SÉCURITÉ INFORMATIQUE
      // ─────────────────────────────────────────
      {
        name: "Sécurité informatique",
        questions: [
          {
            question: "Qu'est-ce qu'une attaque par injection SQL ?",
            choices: ["Une attaque physique sur un serveur", "L'insertion de code SQL malveillant dans une requête pour manipuler la base de données", "Un virus qui corrompt des fichiers SQL", "Une technique de sauvegarde de données"],
            correct: 1,
            explanation: "L'injection SQL consiste à insérer du code SQL malveillant dans les champs d'entrée pour manipuler ou accéder illégalement à la base de données."
          },
          {
            question: "Que signifie l'acronyme HTTPS ?",
            choices: ["HyperText Transfer Protocol Secure", "High Transfer Text Protocol System", "HyperText Transmission Protocol Standard", "Hosted Text Transfer Protocol Secure"],
            correct: 0,
            explanation: "HTTPS = HyperText Transfer Protocol Secure. Il utilise TLS/SSL pour chiffrer les communications entre le navigateur et le serveur."
          },
          {
            question: "Qu'est-ce qu'un pare-feu (firewall) ?",
            choices: ["Un antivirus", "Un système qui surveille et contrôle le trafic réseau selon des règles de sécurité", "Un logiciel de sauvegarde", "Un protocole de communication sécurisé"],
            correct: 1,
            explanation: "Un pare-feu surveille et contrôle le trafic réseau entrant et sortant selon des règles prédéfinies, bloquant les connexions non autorisées."
          },
          {
            question: "Qu'est-ce que le phishing ?",
            choices: ["Une technique de compression de données", "Un type de chiffrement", "Une attaque par usurpation d'identité pour voler des informations sensibles", "Un protocole de transfert de fichiers"],
            correct: 2,
            explanation: "Le phishing est une attaque par ingénierie sociale où l'attaquant se fait passer pour une entité de confiance (banque, service en ligne) pour voler des identifiants ou données."
          },
          {
            question: "Qu'est-ce que le chiffrement symétrique ?",
            choices: ["Un chiffrement avec clé publique et clé privée", "Un chiffrement qui utilise la même clé pour chiffrer et déchiffrer", "Un chiffrement basé sur des nombres premiers", "Un type de compression"],
            correct: 1,
            explanation: "Le chiffrement symétrique utilise la même clé secrète pour chiffrer et déchiffrer les données (ex: AES, DES). Plus rapide que l'asymétrique mais nécessite un échange de clé sécurisé."
          },
          {
            question: "Qu'est-ce qu'une attaque DDoS ?",
            choices: [
              "Un virus qui supprime des données",
              "Une attaque qui inonde un serveur de requêtes pour le rendre indisponible",
              "Une intrusion physique dans un datacenter",
              "Un chiffrement malveillant de fichiers"
            ],
            correct: 1,
            explanation: "Une attaque DDoS (Distributed Denial of Service) utilise un réseau de machines infectées (botnet) pour inonder un serveur de requêtes jusqu'à le rendre indisponible."
          },
          {
            question: "Qu'est-ce que l'authentification à deux facteurs (2FA) ?",
            choices: [
              "Un double mot de passe",
              "Une méthode qui combine deux types de vérification différents pour confirmer l'identité",
              "Deux comptes utilisateurs liés",
              "Un chiffrement à deux clés"
            ],
            correct: 1,
            explanation: "Le 2FA combine deux facteurs : quelque chose que vous connaissez (mot de passe) et quelque chose que vous possédez (code SMS, clé physique) ou êtes (biométrie)."
          },
          {
            question: "Qu'est-ce qu'un ransomware ?",
            choices: [
              "Un logiciel de surveillance réseau",
              "Un malware qui chiffre les fichiers et demande une rançon pour les déchiffrer",
              "Un type de pare-feu",
              "Un protocole d'authentification"
            ],
            correct: 1,
            explanation: "Un ransomware est un malware qui chiffre les données de la victime et exige une rançon (souvent en cryptomonnaie) en échange de la clé de déchiffrement."
          },
          {
            question: "Qu'est-ce qu'une vulnérabilité XSS (Cross-Site Scripting) ?",
            choices: [
              "Une attaque sur les serveurs DNS",
              "L'injection de scripts malveillants dans une page web vue par d'autres utilisateurs",
              "Une faille dans les protocoles réseau",
              "Un virus qui cible les navigateurs"
            ],
            correct: 1,
            explanation: "XSS consiste à injecter du code JavaScript malveillant dans une page web. Lorsque d'autres utilisateurs visitent la page, le script s'exécute dans leur navigateur."
          },
          {
            question: "Qu'est-ce qu'un certificat SSL/TLS ?",
            choices: [
              "Un mot de passe chiffré",
              "Un document numérique qui authentifie l'identité d'un site et permet le chiffrement HTTPS",
              "Un type de pare-feu applicatif",
              "Un protocole de compression"
            ],
            correct: 1,
            explanation: "Un certificat SSL/TLS est émis par une Autorité de Certification. Il confirme l'identité du serveur et permet d'établir une connexion chiffrée (HTTPS)."
          },
          {
            question: "Qu'est-ce que le principe du moindre privilège ?",
            choices: [
              "Donner les droits maximaux à tous les utilisateurs",
              "Accorder à chaque utilisateur uniquement les droits nécessaires à ses fonctions",
              "Supprimer tous les droits des utilisateurs",
              "Partager les mêmes droits entre tous les utilisateurs"
            ],
            correct: 1,
            explanation: "Le principe du moindre privilège (PoLP) consiste à n'accorder que les permissions strictement nécessaires à un utilisateur ou processus, limitant ainsi l'impact d'une compromission."
          },
          {
            question: "Qu'est-ce qu'un test de pénétration (pentest) ?",
            choices: [
              "Un test de vitesse réseau",
              "Une attaque simulée et autorisée pour identifier les vulnérabilités d'un système",
              "Un audit de code source",
              "Un test de charge de serveur"
            ],
            correct: 1,
            explanation: "Un pentest est une cyberattaque simulée et éthique réalisée par des experts pour identifier et exploiter les vulnérabilités d'un système avant que des attaquants réels ne le fassent."
          },
          {
            question: "Que représente la triade CIA en sécurité informatique ?",
            choices: [
              "Contrôle, Intégration, Authentification",
              "Confidentialité, Intégrité, Disponibilité",
              "Chiffrement, Identification, Autorisation",
              "Connexion, Isolation, Accès"
            ],
            correct: 1,
            explanation: "La triade CIA est le modèle fondamental de la sécurité : Confidentialité (accès aux données autorisés seulement), Intégrité (données exactes et non altérées), Disponibilité (accès garanti aux utilisateurs légitimes)."
          },
          {
            question: "Qu'est-ce qu'une attaque de l'homme du milieu (Man-in-the-Middle) ?",
            choices: [
              "Une attaque physique sur un câble réseau",
              "Un attaquant qui s'intercale secrètement dans une communication entre deux parties",
              "Un virus qui s'installe dans la RAM",
              "Une attaque par force brute sur les mots de passe"
            ],
            correct: 1,
            explanation: "Dans une attaque MitM, l'attaquant intercepte secrètement les communications entre deux parties, pouvant lire, modifier ou injecter des données à leur insu."
          },
          {
            question: "Quel est le rôle d'un SIEM en sécurité informatique ?",
            choices: [
              "Chiffrer les données en transit",
              "Collecter, analyser et corréler les événements de sécurité en temps réel",
              "Bloquer automatiquement les attaques DDoS",
              "Gérer les certificats SSL"
            ],
            correct: 1,
            explanation: "Un SIEM (Security Information and Event Management) centralise les logs, détecte des comportements suspects, génère des alertes et aide à la réponse aux incidents de sécurité."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  6. SYSTÈMES D'EXPLOITATION
      // ─────────────────────────────────────────
      {
        name: "Systèmes d'exploitation",
        questions: [
          {
            question: "Quel est le rôle principal d'un système d'exploitation (OS) ?",
            choices: [
              "Développer des applications logicielles",
              "Gérer les ressources matérielles et fournir des services aux applications",
              "Protéger contre les virus",
              "Optimiser les requêtes SQL"
            ],
            correct: 1,
            explanation: "L'OS gère le processeur, la mémoire, les périphériques et le stockage, et fournit une interface entre le matériel et les logiciels."
          },
          {
            question: "Qu'est-ce qu'un processus en informatique ?",
            choices: [
              "Un fichier stocké sur le disque dur",
              "Un programme en cours d'exécution avec ses ressources allouées",
              "Un type de mémoire RAM",
              "Un protocole réseau"
            ],
            correct: 1,
            explanation: "Un processus est un programme en cours d'exécution. Il possède son propre espace mémoire, ses fichiers ouverts et son contexte d'exécution."
          },
          {
            question: "Qu'est-ce qu'un deadlock (interblocage) ?",
            choices: [
              "Un bug qui cause un redémarrage du système",
              "Une situation où deux processus ou plus s'attendent mutuellement indéfiniment",
              "Un type d'attaque réseau",
              "Un mécanisme de sécurité"
            ],
            correct: 1,
            explanation: "Un deadlock survient quand des processus se bloquent mutuellement car chacun attend une ressource détenue par un autre, sans qu'aucun ne puisse progresser."
          },
          {
            question: "Quelle est la différence entre mémoire RAM et ROM ?",
            choices: [
              "La RAM est plus lente que la ROM",
              "La RAM est volatile (perd les données hors tension), la ROM est non volatile (données permanentes)",
              "La ROM est modifiable, la RAM ne l'est pas",
              "Aucune différence"
            ],
            correct: 1,
            explanation: "La RAM (mémoire vive) est volatile : les données disparaissent à l'extinction. La ROM est non volatile et contient des données permanentes comme le BIOS/UEFI."
          },
          {
            question: "Qu'est-ce que la pagination en gestion de la mémoire ?",
            choices: [
              "L'affichage de pages web en mémoire",
              "La division de la mémoire en blocs de taille fixe (pages) pour faciliter l'allocation",
              "La numérotation des fichiers système",
              "Un type de compression de mémoire"
            ],
            correct: 1,
            explanation: "La pagination divise la mémoire physique et virtuelle en pages de taille fixe. Elle permet à l'OS d'allouer de la mémoire de manière non contiguë et implémente la mémoire virtuelle."
          },
          {
            question: "Qu'est-ce qu'un thread ?",
            choices: [
              "Un type de virus informatique",
              "La plus petite unité d'exécution au sein d'un processus, partageant sa mémoire",
              "Un type de fichier système",
              "Un protocole réseau léger"
            ],
            correct: 1,
            explanation: "Un thread est une unité d'exécution légère qui partage l'espace mémoire de son processus parent. Plusieurs threads peuvent s'exécuter en parallèle dans un même processus."
          },
          {
            question: "Qu'est-ce que le noyau (kernel) d'un OS ?",
            choices: [
              "L'interface graphique de l'OS",
              "Le cœur de l'OS qui gère directement le matériel et les ressources système",
              "L'antivirus intégré à l'OS",
              "Le gestionnaire de fichiers"
            ],
            correct: 1,
            explanation: "Le noyau est la partie centrale de l'OS. Il s'exécute en mode privilégié et gère directement la mémoire, les processus, les périphériques et les appels système."
          },
          {
            question: "Quelle commande Linux permet d'afficher les processus en cours d'exécution ?",
            choices: ["ls", "pwd", "ps", "cd"],
            correct: 2,
            explanation: "La commande 'ps' (Process Status) affiche les processus actifs. 'top' et 'htop' offrent une vue dynamique en temps réel."
          },
          {
            question: "Qu'est-ce qu'un système de fichiers ?",
            choices: [
              "Un logiciel de gestion de documents",
              "Une structure qui organise et stocke les fichiers sur un support de stockage",
              "Un type de mémoire cache",
              "Un protocole de transfert de fichiers"
            ],
            correct: 1,
            explanation: "Le système de fichiers (NTFS, ext4, FAT32…) définit comment les données sont organisées, indexées et stockées sur un disque, et comment elles sont retrouvées."
          },
          {
            question: "Qu'est-ce que la mémoire virtuelle ?",
            choices: [
              "Une mémoire RAM qui n'existe pas physiquement",
              "Une technique qui utilise l'espace disque comme extension de la RAM",
              "Un type de mémoire cache",
              "La mémoire des machines virtuelles"
            ],
            correct: 1,
            explanation: "La mémoire virtuelle permet aux programmes d'utiliser plus de mémoire que la RAM disponible en utilisant une partie du disque dur (swap/fichier de pagination) comme mémoire secondaire."
          },
          {
            question: "Quelle est la différence entre un processus et un thread ?",
            choices: [
              "Un thread est plus lourd qu'un processus",
              "Un processus a son propre espace mémoire isolé, les threads partagent celui de leur processus",
              "Les threads ne peuvent pas s'exécuter en parallèle",
              "Un processus est une sous-unité d'un thread"
            ],
            correct: 1,
            explanation: "Un processus est isolé avec son propre espace mémoire. Les threads d'un même processus partagent la mémoire, ce qui les rend plus légers mais nécessite une synchronisation."
          },
          {
            question: "Qu'est-ce qu'un hyperviseur ?",
            choices: [
              "Un type de processeur haute performance",
              "Un logiciel qui crée et gère des machines virtuelles",
              "Un système de fichiers avancé",
              "Un protocole de virtualisation réseau"
            ],
            correct: 1,
            explanation: "Un hyperviseur (VMware, VirtualBox, KVM…) crée et gère des machines virtuelles (VM) en partageant les ressources physiques entre plusieurs OS invités."
          },
          {
            question: "Que signifie l'acronyme BIOS ?",
            choices: [
              "Basic Input Output System",
              "Binary Integrated Operating System",
              "Basic Internal Operating Software",
              "Built-In Operating System"
            ],
            correct: 0,
            explanation: "Le BIOS (Basic Input Output System) est le firmware stocké en ROM qui initialise le matériel au démarrage et amorce le chargement de l'OS. Il est de plus en plus remplacé par l'UEFI."
          },
          {
            question: "Qu'est-ce qu'un signal SIGKILL sous Linux ?",
            choices: [
              "Un signal pour mettre en pause un processus",
              "Un signal qui demande à un processus de se terminer proprement",
              "Un signal de terminaison forcée qu'un processus ne peut pas ignorer",
              "Un signal de redémarrage du système"
            ],
            correct: 2,
            explanation: "SIGKILL (signal 9) force immédiatement la terminaison d'un processus sans lui donner la possibilité de nettoyer ses ressources. Il ne peut pas être ignoré ni intercepté."
          },
          {
            question: "Qu'est-ce que le scheduling (ordonnancement) de processus ?",
            choices: [
              "La planification des sauvegardes automatiques",
              "Le mécanisme qui décide quel processus s'exécute sur le CPU et pendant combien de temps",
              "La gestion des files d'impression",
              "La mise à jour automatique de l'OS"
            ],
            correct: 1,
            explanation: "Le scheduler de l'OS décide de l'ordre et du temps d'utilisation du CPU par les différents processus, selon des algorithmes comme Round Robin, FIFO, ou les files de priorité."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  7. DÉVELOPPEMENT WEB
      // ─────────────────────────────────────────
      {
        name: "Développement Web",
        questions: [
          {
            question: "Que signifie HTML ?",
            choices: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Machine Language", "Hybrid Text Markup Language"],
            correct: 0,
            explanation: "HTML (HyperText Markup Language) est le langage de balisage standard utilisé pour créer la structure des pages web."
          },
          {
            question: "Quelle propriété CSS est utilisée pour centrer un élément horizontalement dans un flexbox ?",
            choices: ["align-items", "justify-content", "text-align", "margin: auto"],
            correct: 1,
            explanation: "Dans un conteneur flex, 'justify-content: center' centre les éléments le long de l'axe principal (horizontal par défaut)."
          },
          {
            question: "Qu'est-ce que le DOM en JavaScript ?",
            choices: [
              "Un langage de programmation",
              "La représentation objet de la structure HTML d'une page, manipulable en JavaScript",
              "Un protocole de communication",
              "Un type de base de données web"
            ],
            correct: 1,
            explanation: "Le DOM (Document Object Model) représente la page HTML comme un arbre d'objets. JavaScript peut le manipuler pour modifier dynamiquement le contenu et la structure de la page."
          },
          {
            question: "Qu'est-ce qu'une requête AJAX ?",
            choices: [
              "Un type d'attaque web",
              "Une technique qui permet d'envoyer/recevoir des données depuis le serveur sans recharger la page",
              "Un framework CSS",
              "Un protocole de chiffrement"
            ],
            correct: 1,
            explanation: "AJAX (Asynchronous JavaScript And XML) permet des échanges asynchrones avec le serveur (aujourd'hui via fetch ou XMLHttpRequest) pour mettre à jour une page sans la recharger."
          },
          {
            question: "Quelle est la différence entre GET et POST en HTTP ?",
            choices: [
              "GET est plus sécurisé que POST",
              "GET envoie les paramètres dans l'URL, POST les envoie dans le corps de la requête",
              "POST est réservé aux téléchargements de fichiers",
              "GET ne peut pas envoyer de données"
            ],
            correct: 1,
            explanation: "GET transmet les paramètres dans l'URL (visible, limité en taille, idempotent). POST les envoie dans le corps de la requête (non visible dans l'URL, adapté aux formulaires et données sensibles)."
          },
          {
            question: "Qu'est-ce que le CSS Box Model ?",
            choices: [
              "Une technique de mise en page CSS",
              "Le modèle qui décrit l'espace occupé par un élément : content, padding, border, margin",
              "Un type de sélecteur CSS",
              "Un framework de mise en page"
            ],
            correct: 1,
            explanation: "Le Box Model CSS décrit chaque élément comme une boîte composée de : content (contenu), padding (espacement interne), border (bordure) et margin (espacement externe)."
          },
          {
            question: "Qu'est-ce que le responsive design ?",
            choices: [
              "Un design qui répond aux clics de l'utilisateur",
              "Une approche qui adapte l'interface à différentes tailles d'écran (mobile, tablette, desktop)",
              "Un framework JavaScript",
              "Une technique d'animation CSS"
            ],
            correct: 1,
            explanation: "Le responsive design utilise des media queries CSS, des grilles flexibles et des images fluides pour que l'interface s'adapte automatiquement à la taille de l'écran."
          },
          {
            question: "Qu'est-ce que le localStorage en JavaScript ?",
            choices: [
              "Un système de fichiers local",
              "Un mécanisme de stockage de données côté client persistant au-delà de la session",
              "Une base de données JavaScript",
              "Un type de cookie sécurisé"
            ],
            correct: 1,
            explanation: "localStorage est une API Web qui permet de stocker des données clé-valeur côté navigateur de manière persistante (contrairement à sessionStorage qui est limité à la session)."
          },
          {
            question: "Qu'est-ce qu'un framework front-end comme React ou Vue ?",
            choices: [
              "Un langage de programmation côté serveur",
              "Une bibliothèque/framework JavaScript qui facilite la création d'interfaces utilisateur réactives",
              "Un serveur web",
              "Un système de gestion de base de données"
            ],
            correct: 1,
            explanation: "React (Meta), Vue (Evan You) et Angular (Google) sont des frameworks/bibliothèques JavaScript qui facilitent la création d'interfaces interactives basées sur des composants réutilisables."
          },
          {
            question: "Qu'est-ce que le protocole WebSocket ?",
            choices: [
              "Un protocole de transfert de fichiers",
              "Un protocole de communication bidirectionnelle en temps réel sur une connexion TCP persistante",
              "Une extension du protocole HTTP",
              "Un protocole de chiffrement web"
            ],
            correct: 1,
            explanation: "WebSocket permet une communication full-duplex et en temps réel entre le navigateur et le serveur sur une seule connexion TCP persistante, idéal pour les chats ou jeux en ligne."
          },
          {
            question: "Que fait la balise HTML <meta name='viewport'> ?",
            choices: [
              "Elle définit le titre de la page",
              "Elle contrôle la manière dont la page est affichée sur les appareils mobiles",
              "Elle ajoute des métadonnées pour le référencement uniquement",
              "Elle lie un fichier CSS externe"
            ],
            correct: 1,
            explanation: "La balise viewport indique au navigateur mobile comment contrôler les dimensions et l'échelle de la page, essentielle pour le responsive design."
          },
          {
            question: "Qu'est-ce que le SEO ?",
            choices: [
              "Un langage de programmation",
              "L'optimisation pour les moteurs de recherche afin d'améliorer le classement d'un site",
              "Un protocole de sécurité web",
              "Un type de serveur web"
            ],
            correct: 1,
            explanation: "Le SEO (Search Engine Optimization) regroupe les pratiques visant à améliorer la visibilité et le classement d'un site dans les résultats de recherche organiques."
          },
          {
            question: "Qu'est-ce qu'un cookie HTTP ?",
            choices: [
              "Un fichier de configuration du serveur",
              "Un petit fichier de données stocké par le navigateur, envoyé au serveur à chaque requête",
              "Un type de session serveur",
              "Une technique de mise en cache"
            ],
            correct: 1,
            explanation: "Un cookie est un petit fichier texte stocké par le navigateur. Il permet au serveur de maintenir un état entre les requêtes (sessions, préférences, suivi)."
          },
          {
            question: "Qu'est-ce que Node.js ?",
            choices: [
              "Un framework front-end JavaScript",
              "Un environnement d'exécution JavaScript côté serveur basé sur le moteur V8",
              "Un système de gestion de base de données",
              "Un langage de programmation"
            ],
            correct: 1,
            explanation: "Node.js permet d'exécuter du JavaScript côté serveur grâce au moteur V8 de Chrome. Son modèle événementiel non-bloquant le rend adapté aux applications temps réel."
          },
          {
            question: "Que signifie CORS ?",
            choices: [
              "Cross-Origin Resource Sharing — mécanisme permettant à un navigateur d'accéder à des ressources d'un domaine différent",
              "Common Object Request System",
              "Cross-Origin Response Security",
              "Client-Oriented Resource Server"
            ],
            correct: 0,
            explanation: "CORS est une politique de sécurité des navigateurs qui, par défaut, bloque les requêtes vers un domaine différent. Les serveurs peuvent l'autoriser via des en-têtes HTTP spécifiques."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  8. ARCHITECTURE & HARDWARE
      // ─────────────────────────────────────────
      {
        name: "Architecture & Hardware",
        questions: [
          {
            question: "Qu'est-ce que l'ALU dans un processeur ?",
            choices: [
              "Arithmetic Logic Unit — unité qui effectue les opérations arithmétiques et logiques",
              "Advanced Loading Unit",
              "Automatic Link Updater",
              "Application Layer Unit"
            ],
            correct: 0,
            explanation: "L'ALU (Arithmetic Logic Unit) est le composant du processeur qui effectue les opérations arithmétiques (addition, soustraction…) et logiques (AND, OR, NOT…)."
          },
          {
            question: "Qu'est-ce que la mémoire cache du processeur ?",
            choices: [
              "Une sauvegarde automatique de la RAM",
              "Une mémoire très rapide intégrée au processeur pour stocker les données fréquemment utilisées",
              "Un disque dur haute vitesse",
              "La mémoire vidéo du GPU"
            ],
            correct: 1,
            explanation: "La mémoire cache (L1, L2, L3) est une mémoire ultra-rapide proche du CPU. Elle réduit le temps d'accès aux données fréquemment utilisées, évitant d'aller chercher en RAM."
          },
          {
            question: "Quelle est la différence entre un CPU et un GPU ?",
            choices: [
              "Le GPU est plus puissant dans tous les cas",
              "Le CPU est optimisé pour des tâches séquentielles complexes, le GPU pour des calculs parallèles massifs",
              "Le GPU gère la mémoire RAM, le CPU gère la mémoire vidéo",
              "Le CPU et le GPU font le même travail"
            ],
            correct: 1,
            explanation: "Le CPU a quelques cœurs puissants pour des tâches séquentielles. Le GPU a des milliers de petits cœurs pour traiter des milliers d'opérations simples en parallèle (graphisme, IA)."
          },
          {
            question: "Qu'est-ce que le bus de données dans un ordinateur ?",
            choices: [
              "Un logiciel de gestion de transport",
              "Un canal de communication qui transfère des données entre les composants de l'ordinateur",
              "Un type de mémoire partagée",
              "Un protocole réseau interne"
            ],
            correct: 1,
            explanation: "Le bus est un ensemble de conducteurs électriques qui permettent le transfert de données entre le CPU, la RAM, les cartes d'extension et autres composants."
          },
          {
            question: "Qu'est-ce que la fréquence d'horloge d'un processeur ?",
            choices: [
              "La vitesse de la connexion réseau",
              "Le nombre de cycles d'opérations que le CPU peut effectuer par seconde",
              "La vitesse de lecture/écriture du disque dur",
              "La fréquence de rafraîchissement de l'écran"
            ],
            correct: 1,
            explanation: "La fréquence d'horloge (en GHz) indique combien de cycles le processeur effectue par seconde. Un processeur à 3 GHz effectue 3 milliards de cycles par seconde."
          },
          {
            question: "Quelle est la différence entre un disque HDD et un SSD ?",
            choices: [
              "Le SSD est moins fiable que le HDD",
              "Le HDD utilise des plateaux magnétiques rotatifs, le SSD utilise de la mémoire flash sans pièces mobiles",
              "Le HDD est plus rapide en lecture",
              "Les deux technologies sont identiques"
            ],
            correct: 1,
            explanation: "Le HDD (disque dur) utilise des plateaux magnétiques rotatifs — moins cher, plus lent, fragile aux chocs. Le SSD utilise la mémoire flash — plus rapide, silencieux, résistant, mais plus cher."
          },
          {
            question: "Qu'est-ce que le pipeline dans l'architecture d'un processeur ?",
            choices: [
              "Un câble qui relie le CPU à la RAM",
              "Une technique qui permet d'exécuter plusieurs instructions en se chevauchant pour améliorer les performances",
              "Un type de mémoire cache",
              "Un protocole de communication entre CPU et GPU"
            ],
            correct: 1,
            explanation: "Le pipeline divise l'exécution d'une instruction en étapes (fetch, decode, execute, write-back…) et permet à plusieurs instructions d'être à différentes étapes simultanément."
          },
          {
            question: "Qu'est-ce que l'architecture RISC ?",
            choices: [
              "Reduced Instruction Set Computer — processeur avec un jeu d'instructions simple et réduit",
              "Rapid Instruction Speed Computer",
              "Real-time Instruction Set Controller",
              "Remote Integrated System Circuit"
            ],
            correct: 0,
            explanation: "RISC (Reduced Instruction Set Computer) utilise un petit nombre d'instructions simples exécutées rapidement (en un cycle). ARM est un exemple populaire. L'opposé est CISC (x86)."
          },
          {
            question: "Qu'est-ce que le chipset d'une carte mère ?",
            choices: [
              "Un ensemble de processeurs graphiques",
              "Un ensemble de circuits intégrés qui contrôlent la communication entre le CPU, la RAM et les périphériques",
              "La mémoire BIOS",
              "Un type de connecteur PCIe"
            ],
            correct: 1,
            explanation: "Le chipset est le 'chef d'orchestre' de la carte mère. Il coordonne les échanges de données entre le processeur, la mémoire vive, les cartes d'extension et les périphériques."
          },
          {
            question: "Qu'est-ce que la mémoire VRAM ?",
            choices: [
              "Une variante de la mémoire virtuelle",
              "La mémoire dédiée du GPU, utilisée pour stocker les textures et les données graphiques",
              "Un type de mémoire cache L3",
              "La mémoire morte du BIOS"
            ],
            correct: 1,
            explanation: "La VRAM (Video RAM) est la mémoire intégrée dans la carte graphique. Elle stocke les textures, tampons de trame et données graphiques pour un accès rapide par le GPU."
          },
          {
            question: "Que représente le nombre de cœurs (cores) dans un processeur moderne ?",
            choices: [
              "Le nombre de transistors",
              "Le nombre d'unités de traitement indépendantes capables d'exécuter des tâches en parallèle",
              "La fréquence d'horloge",
              "La taille du cache L2"
            ],
            correct: 1,
            explanation: "Chaque cœur est une unité de traitement indépendante. Un processeur 8 cœurs peut traiter 8 tâches en simultané, améliorant les performances multitâches."
          },
          {
            question: "Qu'est-ce que l'interface PCIe (PCI Express) ?",
            choices: [
              "Un protocole réseau",
              "Un bus série haute vitesse pour connecter des cartes d'extension (GPU, SSD NVMe…) à la carte mère",
              "Un type de connecteur d'alimentation",
              "Un protocole de communication USB"
            ],
            correct: 1,
            explanation: "PCIe est un bus série haute vitesse qui remplace PCI. Il est utilisé pour connecter les cartes graphiques, les SSD NVMe et d'autres cartes d'extension à la carte mère."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  9. CLOUD & DEVOPS
      // ─────────────────────────────────────────
      {
        name: "Cloud & DevOps",
        questions: [
          {
            question: "Que signifie IaaS dans le cloud computing ?",
            choices: [
              "Infrastructure as a Service — fourniture de ressources matérielles virtualisées à la demande",
              "Integration as a Service",
              "Internet as a System",
              "Intelligent Automation as a Service"
            ],
            correct: 0,
            explanation: "IaaS fournit des ressources informatiques virtualisées (serveurs, stockage, réseau) via Internet. Exemples : AWS EC2, Azure VMs, Google Compute Engine."
          },
          {
            question: "Qu'est-ce que Docker ?",
            choices: [
              "Un langage de programmation pour le cloud",
              "Un outil de conteneurisation qui empaquette une application et ses dépendances dans un conteneur portable",
              "Un fournisseur de services cloud",
              "Un système d'exploitation léger"
            ],
            correct: 1,
            explanation: "Docker crée des conteneurs légers et portables qui encapsulent une application et toutes ses dépendances, garantissant un comportement identique quel que soit l'environnement."
          },
          {
            question: "Quelle est la différence entre un conteneur Docker et une machine virtuelle ?",
            choices: [
              "Les conteneurs sont plus lents que les VMs",
              "Les conteneurs partagent le noyau de l'OS hôte et sont plus légers, les VMs ont leur propre OS complet",
              "Les VMs consomment moins de ressources",
              "Aucune différence notable"
            ],
            correct: 1,
            explanation: "Les conteneurs partagent le noyau de l'OS hôte, démarrent en secondes et consomment peu de ressources. Les VMs embarquent un OS complet, sont plus isolées mais plus lourdes."
          },
          {
            question: "Qu'est-ce que Kubernetes ?",
            choices: [
              "Un langage de programmation pour le cloud",
              "Un outil d'orchestration de conteneurs qui automatise le déploiement et la gestion à grande échelle",
              "Un service de stockage cloud",
              "Un système de monitoring réseau"
            ],
            correct: 1,
            explanation: "Kubernetes (K8s) automatise le déploiement, la mise à l'échelle et la gestion de conteneurs. Il répartit la charge, assure la disponibilité et gère les défaillances automatiquement."
          },
          {
            question: "Qu'est-ce que l'intégration continue (CI) ?",
            choices: [
              "L'intégration de différents services cloud",
              "La pratique d'intégrer fréquemment le code dans un dépôt partagé avec vérification automatique",
              "Une méthode de déploiement manuel",
              "Un type de test de performance"
            ],
            correct: 1,
            explanation: "La CI (Continuous Integration) consiste à fusionner le code régulièrement dans un dépôt commun et à déclencher automatiquement des builds et tests pour détecter les erreurs tôt."
          },
          {
            question: "Que signifie SaaS ?",
            choices: [
              "Software as a Service — logiciel hébergé dans le cloud et accessible via un navigateur",
              "System as a Solution",
              "Security as a Service",
              "Storage as a System"
            ],
            correct: 0,
            explanation: "SaaS est un modèle de distribution où le logiciel est hébergé dans le cloud et accessible via Internet sans installation locale. Exemples : Gmail, Slack, Salesforce, Microsoft 365."
          },
          {
            question: "Qu'est-ce que l'infrastructure as code (IaC) ?",
            choices: [
              "La programmation des processeurs",
              "La gestion et le provisionnement de l'infrastructure via des fichiers de configuration versionnés",
              "Un type de conteneur cloud",
              "La programmation de firmware"
            ],
            correct: 1,
            explanation: "L'IaC permet de définir l'infrastructure (serveurs, réseaux, BDD) dans des fichiers de code (Terraform, CloudFormation) versionnable, reproductible et automatisable."
          },
          {
            question: "Qu'est-ce que le load balancing ?",
            choices: [
              "La compression des données dans le cloud",
              "La distribution du trafic entrant sur plusieurs serveurs pour optimiser les performances et la disponibilité",
              "Un type de sauvegarde cloud",
              "La gestion de la bande passante"
            ],
            correct: 1,
            explanation: "Le load balancer répartit les requêtes entrantes sur plusieurs serveurs, évitant la surcharge d'un seul serveur et assurant la haute disponibilité de l'application."
          },
          {
            question: "Qu'est-ce qu'un pipeline CI/CD ?",
            choices: [
              "Un réseau de câbles dans un datacenter",
              "Un ensemble automatisé d'étapes pour tester, valider et déployer le code en production",
              "Un protocole réseau pour les microservices",
              "Un type de base de données distribuée"
            ],
            correct: 1,
            explanation: "Un pipeline CI/CD automatise le flux de : commit → build → tests → validation → déploiement, réduisant les erreurs humaines et accélérant la livraison de logiciels."
          },
          {
            question: "Qu'est-ce qu'une architecture microservices ?",
            choices: [
              "Une application très légère",
              "Un style d'architecture qui décompose une application en petits services indépendants communiquant via des API",
              "Un type de conteneur Docker minimal",
              "Un système d'exploitation pour microprocesseurs"
            ],
            correct: 1,
            explanation: "Les microservices décomposent une application en services indépendants (authentification, paiement, catalogue…), chacun déployable séparément, à l'opposé de l'architecture monolithique."
          },
          {
            question: "Qu'est-ce que le monitoring (supervision) dans un environnement cloud ?",
            choices: [
              "La surveillance physique des serveurs",
              "La collecte et l'analyse de métriques (CPU, mémoire, latence…) pour détecter les anomalies et alerter",
              "Un type de test de sécurité",
              "La gestion des droits d'accès"
            ],
            correct: 1,
            explanation: "Le monitoring collecte en temps réel des métriques système et applicatives, crée des tableaux de bord et envoie des alertes pour permettre une réponse rapide aux incidents."
          },
          {
            question: "Qu'est-ce que le serverless computing ?",
            choices: [
              "Un cloud sans serveurs physiques",
              "Un modèle où le développeur déploie du code sans gérer l'infrastructure sous-jacente",
              "Un type de virtualisation légère",
              "Un système distribué sans point central"
            ],
            correct: 1,
            explanation: "Le serverless (AWS Lambda, Azure Functions…) permet d'exécuter du code à la demande sans gérer de serveurs. Le fournisseur alloue automatiquement les ressources et facture à l'usage."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  10. INTELLIGENCE ARTIFICIELLE
      // ─────────────────────────────────────────
      {
        name: "Intelligence Artificielle",
        questions: [
          {
            question: "Qu'est-ce que le machine learning (apprentissage automatique) ?",
            choices: [
              "La programmation manuelle de règles pour résoudre des problèmes",
              "Un domaine de l'IA où les systèmes apprennent à partir de données sans être explicitement programmés",
              "Un algorithme de tri avancé",
              "Un type de base de données intelligente"
            ],
            correct: 1,
            explanation: "Le machine learning permet aux systèmes d'apprendre et de s'améliorer automatiquement à partir de données et d'expériences, sans être programmés pour chaque cas."
          },
          {
            question: "Quelle est la différence entre l'apprentissage supervisé et non supervisé ?",
            choices: [
              "L'apprentissage supervisé est plus rapide",
              "L'apprentissage supervisé utilise des données étiquetées, le non supervisé trouve des structures dans des données non étiquetées",
              "L'apprentissage non supervisé nécessite plus de données",
              "Aucune différence fondamentale"
            ],
            correct: 1,
            explanation: "En apprentissage supervisé, on fournit des données avec leurs étiquettes (réponses correctes). En non supervisé, l'algorithme découvre lui-même des structures (clusters) dans les données."
          },
          {
            question: "Qu'est-ce qu'un réseau de neurones artificiel ?",
            choices: [
              "Un réseau informatique bio-inspiré",
              "Un modèle inspiré du cerveau humain, composé de couches de neurones artificiels qui traitent l'information",
              "Un algorithme de tri basé sur la biologie",
              "Un type de base de données distribuée"
            ],
            correct: 1,
            explanation: "Un réseau de neurones artificiel est composé de couches de nœuds (neurones) connectés. Les poids des connexions s'ajustent pendant l'entraînement pour apprendre des patterns."
          },
          {
            question: "Qu'est-ce que le deep learning ?",
            choices: [
              "Un apprentissage qui prend beaucoup de temps",
              "Un sous-domaine du machine learning utilisant des réseaux de neurones à multiples couches profondes",
              "Un algorithme de recherche exhaustive",
              "Une technique d'optimisation de base de données"
            ],
            correct: 1,
            explanation: "Le deep learning utilise des réseaux de neurones avec de nombreuses couches cachées pour apprendre des représentations hiérarchiques complexes des données (images, son, texte)."
          },
          {
            question: "Qu'est-ce que l'overfitting (surapprentissage) en machine learning ?",
            choices: [
              "Un modèle trop simple pour apprendre",
              "Quand un modèle apprend trop bien les données d'entraînement et se généralise mal aux nouvelles données",
              "Un manque de données d'entraînement",
              "Un problème de vitesse d'entraînement"
            ],
            correct: 1,
            explanation: "L'overfitting survient quand un modèle mémorise les données d'entraînement (y compris le bruit) et performe mal sur de nouvelles données. On le combat avec la régularisation, le dropout ou plus de données."
          },
          {
            question: "Qu'est-ce qu'un algorithme de classification en ML ?",
            choices: [
              "Un algorithme qui trie des données alphabétiquement",
              "Un algorithme qui prédit à quelle catégorie appartient un exemple",
              "Un algorithme de compression de données",
              "Un algorithme de recherche de doublons"
            ],
            correct: 1,
            explanation: "La classification assigne chaque exemple à une catégorie prédéfinie (spam/non-spam, chat/chien…). Exemples d'algorithmes : régression logistique, SVM, arbres de décision, réseaux de neurones."
          },
          {
            question: "Qu'est-ce que le traitement du langage naturel (NLP) ?",
            choices: [
              "Un protocole de communication réseau",
              "Un domaine de l'IA qui permet aux machines de comprendre, interpréter et générer du langage humain",
              "Un type de chiffrement basé sur le langage",
              "Une technique de compression de texte"
            ],
            correct: 1,
            explanation: "Le NLP (Natural Language Processing) permet aux ordinateurs d'analyser, comprendre et générer du texte ou de la parole humaine. Il est à la base des chatbots, traducteurs et assistants vocaux."
          },
          {
            question: "Qu'est-ce que la fonction de perte (loss function) en deep learning ?",
            choices: [
              "Une fonction qui mesure la vitesse d'entraînement",
              "Une fonction qui mesure l'écart entre les prédictions du modèle et les valeurs réelles",
              "Une fonction d'activation du réseau",
              "Une fonction de compression des données"
            ],
            correct: 1,
            explanation: "La loss function quantifie l'erreur du modèle. L'objectif de l'entraînement est de minimiser cette erreur via l'optimisation (descente de gradient). Exemples : MSE, cross-entropie."
          },
          {
            question: "Qu'est-ce qu'un LLM (Large Language Model) ?",
            choices: [
              "Un type de base de données pour le langage",
              "Un modèle de deep learning entraîné sur de grandes quantités de texte pour générer et comprendre le langage",
              "Un algorithme de compression de texte",
              "Un protocole de communication réseau"
            ],
            correct: 1,
            explanation: "Un LLM est un modèle de langage (basé sur Transformer) entraîné sur d'immenses corpus de texte. Il peut générer du texte, répondre à des questions, traduire… Exemples : GPT, Claude, Gemini."
          },
          {
            question: "Qu'est-ce que le reinforcement learning (apprentissage par renforcement) ?",
            choices: [
              "Un apprentissage qui utilise uniquement des données étiquetées",
              "Un type d'apprentissage où un agent apprend en interagissant avec un environnement et en recevant des récompenses/punitions",
              "Un algorithme de clustering",
              "Une technique de régression linéaire"
            ],
            correct: 1,
            explanation: "En reinforcement learning, un agent prend des actions dans un environnement pour maximiser une récompense cumulative. Utilisé dans les jeux (AlphaGo), la robotique et les véhicules autonomes."
          },
          {
            question: "Qu'est-ce qu'une matrice de confusion en évaluation de modèle ML ?",
            choices: [
              "Un tableau qui montre les performances du modèle en croisant les prédictions et les valeurs réelles",
              "Une erreur fréquente dans les réseaux de neurones",
              "Un tableau de paramètres d'entraînement",
              "Un type de visualisation de données"
            ],
            correct: 0,
            explanation: "La matrice de confusion compare les classes prédites aux classes réelles. Elle permet de calculer la précision, le rappel, le F1-score et d'identifier les types d'erreurs du modèle."
          },
          {
            question: "Qu'est-ce que la descente de gradient ?",
            choices: [
              "Un algorithme de tri",
              "Un algorithme d'optimisation qui ajuste les paramètres d'un modèle pour minimiser la fonction de perte",
              "Une technique de visualisation de données",
              "Un protocole de communication réseau"
            ],
            correct: 1,
            explanation: "La descente de gradient ajuste itérativement les poids du modèle dans la direction opposée au gradient de la loss function, réduisant progressivement l'erreur."
          }
        ]
      },

      // ─────────────────────────────────────────
      //  11. GÉNIE LOGICIEL
      // ─────────────────────────────────────────
      {
        name: "Génie Logiciel",
        questions: [
          {
            question: "Qu'est-ce que la méthode Agile ?",
            choices: [
              "Une méthode de développement linéaire en cascade",
              "Un ensemble de pratiques itératives et collaboratives pour développer des logiciels de façon flexible",
              "Un langage de programmation moderne",
              "Un outil de gestion de version"
            ],
            correct: 1,
            explanation: "Agile est un ensemble de méthodes (Scrum, Kanban…) basées sur des itérations courtes (sprints), la collaboration client, et l'adaptation aux changements plutôt que le suivi d'un plan rigide."
          },
          {
            question: "Qu'est-ce qu'un test unitaire ?",
            choices: [
              "Un test effectué par l'utilisateur final",
              "Un test qui vérifie le comportement d'une unité isolée de code (fonction, méthode)",
              "Un test de performance globale du système",
              "Un test de sécurité"
            ],
            correct: 1,
            explanation: "Un test unitaire vérifie qu'une petite unité de code (fonction, méthode) fonctionne correctement en isolation. Il est automatisé et exécuté fréquemment pour détecter les régressions."
          },
          {
            question: "Qu'est-ce que le principe SOLID ?",
            choices: [
              "Un algorithme de tri",
              "Un ensemble de 5 principes de conception orientée objet pour rendre le code maintenable",
              "Un framework de tests",
              "Un protocole de sécurité"
            ],
            correct: 1,
            explanation: "SOLID : Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Ces principes guident la conception de code robuste et maintenable."
          },
          {
            question: "Qu'est-ce que le refactoring ?",
            choices: [
              "La réécriture complète d'une application",
              "La restructuration du code existant sans changer son comportement pour améliorer la lisibilité et la maintenabilité",
              "La création de nouveaux tests automatisés",
              "La migration vers un nouveau langage"
            ],
            correct: 1,
            explanation: "Le refactoring améliore la structure interne du code (lisibilité, performance, maintenabilité) sans modifier son comportement externe, sécurisé par des tests automatisés."
          },
          {
            question: "Qu'est-ce qu'un sprint en méthodologie Scrum ?",
            choices: [
              "Un test de performance du logiciel",
              "Une itération de développement de durée fixe (généralement 1 à 4 semaines) avec des objectifs définis",
              "Une réunion d'équipe hebdomadaire",
              "Un déploiement urgent en production"
            ],
            correct: 1,
            explanation: "Un sprint Scrum est une itération de durée fixe (1-4 semaines) pendant laquelle l'équipe produit un incrément potentiellement livrable du produit."
          },
          {
            question: "Qu'est-ce que le TDD (Test-Driven Development) ?",
            choices: [
              "Une méthode où les tests sont écrits après le code",
              "Une méthode où les tests sont écrits avant le code, guidant son développement",
              "Un type de test d'intégration",
              "Un framework de tests automatisés"
            ],
            correct: 1,
            explanation: "Le TDD suit le cycle Red-Green-Refactor : écrire un test qui échoue, écrire le code minimal pour le faire passer, puis refactoriser. Les tests guident la conception du code."
          },
          {
            question: "Qu'est-ce qu'une code review (revue de code) ?",
            choices: [
              "Un audit de sécurité automatisé",
              "L'examen du code source par des pairs pour détecter les bugs, améliorer la qualité et partager les connaissances",
              "Un test de performance du code",
              "Une comparaison de versions de code"
            ],
            correct: 1,
            explanation: "La revue de code est une pratique où d'autres développeurs lisent et commentent le code d'un collègue avant son intégration, améliorant la qualité et favorisant le partage de connaissances."
          },
          {
            question: "Qu'est-ce qu'une dette technique ?",
            choices: [
              "Le coût financier d'un projet logiciel",
              "L'accumulation de solutions rapides et imparfaites qui augmentent la complexité et le coût de maintenance futur",
              "Le nombre de bugs non résolus",
              "Le retard de livraison d'un projet"
            ],
            correct: 1,
            explanation: "La dette technique désigne les compromis de qualité acceptés pour livrer plus vite. Comme une dette financière, elle s'accumule et génère des 'intérêts' sous forme de ralentissements futurs."
          },
          {
            question: "Qu'est-ce que le modèle en cascade (Waterfall) ?",
            choices: [
              "Une méthode agile avec des itérations courtes",
              "Un modèle de développement séquentiel avec des phases distinctes (analyse → conception → implémentation → test → déploiement)",
              "Un type de pipeline CI/CD",
              "Un modèle de gestion de base de données"
            ],
            correct: 1,
            explanation: "Le modèle Waterfall est un processus linéaire et séquentiel où chaque phase doit être terminée avant de passer à la suivante. Peu flexible aux changements en cours de projet."
          },
          {
            question: "Qu'est-ce qu'un diagramme UML ?",
            choices: [
              "Un type de langage de programmation visuel",
              "Un langage de modélisation standardisé pour visualiser la conception d'un système logiciel",
              "Un outil de gestion de version graphique",
              "Un protocole de communication entre composants"
            ],
            correct: 1,
            explanation: "UML (Unified Modeling Language) est un langage de modélisation standardisé. Il propose divers diagrammes (classes, séquence, cas d'utilisation…) pour documenter et concevoir des systèmes."
          }
        ]
      }

    ]
  }
  // ─────────────────────────────────────────────────────────
  // Autres matières à venir — même structure à respecter :
  // ─────────────────────────────────────────────────────────
  // mathematiques: { label: "Mathématiques", icon: "📐", color: "#059669", categories: [...] },
  // physique:      { label: "Physique",       icon: "⚛️",  color: "#dc2626", categories: [...] },
  // histoire:      { label: "Histoire",       icon: "📜",  color: "#b45309", categories: [...] },
};
