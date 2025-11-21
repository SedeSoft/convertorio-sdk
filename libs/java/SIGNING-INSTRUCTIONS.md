# Instrucciones para Firmar Artifacts para Maven Central

## Archivos Generados (Listos para firmar)

En `sdk/libs/java/target/`:

✅ `convertorio-sdk-1.2.0.jar` (20 KB)
✅ `convertorio-sdk-1.2.0.pom`
✅ `convertorio-sdk-1.2.0-sources.jar` (11 KB)
✅ `convertorio-sdk-1.2.0-javadoc.jar` (4.1 MB)

## Problema Actual

GPG tiene un proceso bloqueado (PID 440). Necesitas resolver esto primero.

## Solución

### Opción 1: Reiniciar el sistema (Recomendado)

Esto liberará todos los locks de GPG.

### Opción 2: Matar procesos GPG manualmente

Abre PowerShell como Administrador y ejecuta:

```powershell
# Matar todos los procesos GPG
taskkill /F /IM gpg-agent.exe
taskkill /F /IM gpg.exe
taskkill /F /IM dirmngr.exe

# Verificar que no hay procesos GPG
Get-Process | Where-Object {$_.ProcessName -like '*gpg*'}
```

## Pasos para Firmar (Después de resolver el bloqueo)

### 1. Verificar que tienes una clave GPG

```bash
gpg --list-secret-keys
```

Si no tienes ninguna clave, crea una:

```bash
gpg --gen-key
# Sigue las instrucciones:
# - Nombre: Tu nombre
# - Email: tu@email.com
# - Contraseña: (elige una segura)
```

### 2. Publicar tu clave pública a un servidor de claves

```bash
# Obtener el ID de tu clave
gpg --list-secret-keys

# El ID está en la línea que dice "sec"
# Ejemplo: sec   rsa3072/ABCD1234EF567890

# Publicar la clave
gpg --keyserver keyserver.ubuntu.com --send-keys ABCD1234EF567890
```

### 3. Firmar todos los artifacts

#### Opción A: Usar el script automático

```bash
cd C:\GitRepos\convertorio-com\sdk\libs\java
bash sign-artifacts.sh
```

#### Opción B: Firmar manualmente

```bash
cd C:\GitRepos\convertorio-com\sdk\libs\java\target

# Firmar cada archivo
gpg --armor --detach-sign convertorio-sdk-1.2.0.jar
gpg --armor --detach-sign convertorio-sdk-1.2.0.pom
gpg --armor --detach-sign convertorio-sdk-1.2.0-sources.jar
gpg --armor --detach-sign convertorio-sdk-1.2.0-javadoc.jar
```

Esto generará 4 archivos `.asc`:
- `convertorio-sdk-1.2.0.jar.asc`
- `convertorio-sdk-1.2.0.pom.asc`
- `convertorio-sdk-1.2.0-sources.jar.asc`
- `convertorio-sdk-1.2.0-javadoc.jar.asc`

### 4. Verificar que todos los archivos están listos

```bash
cd C:\GitRepos\convertorio-com\sdk\libs\java\target
ls -lh convertorio-sdk-1.2.0*
```

Deberías ver 8 archivos en total:
- 4 archivos principales (jar, pom, sources, javadoc)
- 4 archivos de firma (.asc)

## Publicar en Maven Central

### Opción 1: Usar Maven (Recomendado)

```bash
cd C:\GitRepos\convertorio-com\sdk\libs\java

# Configurar credenciales de Sonatype en ~/.m2/settings.xml
# (ver más abajo)

# Desplegar
export JAVA_HOME=/c/jdk
export PATH=$JAVA_HOME/bin:/c/maven/bin:$PATH
mvn clean deploy -P release
```

### Opción 2: Subir manualmente al portal de Sonatype

1. Ve a https://s01.oss.sonatype.org/
2. Login con tus credenciales
3. Click en "Staging Upload"
4. Sube los 8 archivos
5. Click en "Close" y luego "Release"

## Configurar Maven Settings (Para opción 1)

Crear o editar `~/.m2/settings.xml`:

```xml
<settings>
  <servers>
    <server>
      <id>ossrh</id>
      <username>tu-usuario-sonatype</username>
      <password>tu-contraseña-sonatype</password>
    </server>
  </servers>

  <profiles>
    <profile>
      <id>ossrh</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <properties>
        <gpg.executable>gpg</gpg.executable>
        <gpg.passphrase>tu-passphrase-gpg</gpg.passphrase>
      </properties>
    </profile>
  </profiles>
</settings>
```

## Verificación Final

Después de publicar, verifica en Maven Central:
- https://search.maven.org/artifact/com.sedesoft/convertorio-sdk

Puede tomar 10-30 minutos en aparecer en el buscador.

## Troubleshooting

### Error: "no default secret key"
- Asegúrate de tener una clave GPG creada: `gpg --gen-key`

### Error: "signing failed"
- Verifica que el gpg-agent esté corriendo: `gpgconf --kill gpg-agent && gpg-connect-agent /bye`
- Si persiste, reinicia el sistema

### Error: "Connection timed out"
- Hay un lock en la base de datos de GPG
- Solución: Reiniciar el sistema o matar procesos GPG

### Error: "No such file"
- Asegúrate de estar en el directorio correcto: `cd sdk/libs/java/target`
- Verifica que los archivos existen: `ls -lh convertorio-sdk-1.2.0*`

## Recursos

- Maven Central Guide: https://central.sonatype.org/publish/publish-guide/
- GPG Guide: https://central.sonatype.org/publish/requirements/gpg/
- Sonatype JIRA: https://issues.sonatype.org/
