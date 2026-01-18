# 🧪 Testez une Application Full Stack

Ce projet est une application **full stack** composée :

- d'un **backend Spring Boot**
- d'un **frontend Angular**
- de **tests unitaires, d'intégration et end-to-end**

---

## 🚀 Installation

### 📋 Prérequis

Assure-toi d'avoir installé sur ta machine :

- **Node.js** (v14 ou supérieur)
- **npm** (ou yarn)
- **Java JDK 11+**
- **Maven**
- **MySQL** (port 3306)
- **Git**

---

## 🗄️ Base de données

1. Installer **MySQL**
2. Démarrer MySQL sur le port **3306**
3. Créer une base de données :
   ```sql
   CREATE DATABASE yoga_app;
   ```
4. Vérifier les identifiants MySQL (utilisateur / mot de passe)

---

## ⚙️ Backend (Spring Boot)

### 📁 Accéder au dossier backend

```bash
cd back
```

### 🔧 Configuration

Configurer la connexion à la base de données dans :

```
src/main/resources/application.properties
```

Exemple :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/yoga_app
spring.datasource.username=root
spring.datasource.password=your_password
```

### 📦 Installer les dépendances

```bash
mvn clean install
```

### ▶️ Lancer le backend

```bash
mvn spring-boot:run
```

Le backend est accessible sur : `http://localhost:8080`

### 🧪 Lancer les tests backend

```bash
mvn test
```

### 👉 Rapport de couverture généré avec JaCoCo

```
target/site/jacoco/index.html
```

---

## 🎨 Frontend (Angular)

### 📁 Accéder au dossier frontend

```bash
cd front
```

### 📦 Installer les dépendances

```bash
npm install
```

### ▶️ Lancer l'application frontend

```bash
npm start
```

L'application est accessible sur : `http://localhost:4200`

### 🧪 Lancer les tests frontend (unitaires + intégration)

```bash
ng test
```

### 👉 Rapport de couverture

```
coverage/index.html
```

---

## 🌐 Tests End-to-End (Cypress)

### ▶️ Lancer les tests E2E

```bash
npx cypress run
```
