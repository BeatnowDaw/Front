import React, { useState, useEffect } from "react";
import styles from "./UserSettings.module.css"; // Importamos las clases CSS Modules
import UserSingleton from "../../Model/UserSingleton";

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // Agregar userId como prop (puedes obtenerlo de un UserSingleton o estado global)
}

const UserSettings: React.FC<SettingsPopupProps> = ({ isOpen, onClose, userId }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Puedes obtener los datos actuales del usuario si es necesario
      // Por ejemplo, hacer una solicitud GET a la API para obtener los datos del usuario actual
    }
  }, [isOpen]);
   function handleLogout () {
        localStorage.removeItem("token");
        UserSingleton.getInstance().clear();
        window.location.href = "/";
    };
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear el objeto con los datos para la solicitud PUT
    const formData = {
      full_name: "", // Si quieres agregar un campo para el nombre completo, recógelo en un state
      username,
      email,
      password,
      is_active: isActive,
      bio,
      id: userId, // El ID del usuario
    };

    // Obtener el token desde localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    // Crear el objeto de configuración de la solicitud PUT
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Añadir el token en los encabezados
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch("http://127.0.0.1:8001/v1/api/users/update", requestOptions);
      const data = await response.json();

      if (response.ok) {
        console.log("Usuario actualizado exitosamente:", data);
        onClose(); // Cerrar el popup después de que se haya guardado correctamente
      } else {
        console.error("Error al actualizar el usuario:", data);
        // Puedes mostrar un mensaje de error aquí
      }
    } catch (error) {
      console.error("Hubo un error con la solicitud:", error);
      // Puedes manejar errores aquí, como mostrar un mensaje al usuario
    }
handleLogout() // Llamar a la función de logout después de actualizar el usuario;

};

const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(`http://127.0.0.1:8001/v1/api/users/delete`, requestOptions);
        if (response.ok) {
            console.log("Cuenta eliminada exitosamente");
            onClose(); // Cerrar el popup después de eliminar la cuenta
            handleLogout(); // Llamar a la función de logout después de eliminar la cuenta
        } else {
            const data = await response.json();
            console.error("Error al eliminar la cuenta:", data);
            // Puedes mostrar un mensaje de error aquí
        }
    } catch (error) {
        console.error("Hubo un error con la solicitud de eliminación:", error);
        // Puedes manejar errores aquí, como mostrar un mensaje al usuario
        }
    }


 

  if (!isOpen) return null; // Si el popup no está abierto, no renderizarlo

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Actualizar cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.inp}    
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inp}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña (si deseas cambiarla)</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inp}
            />
          </div>
          <button className={styles.btnUpdate} type="submit">Guardar cambios</button>
        </form>
        
        <button onClick={handleDeleteAccount} className={styles.closeBtn}>Eliminar cuenta</button>
        <p className={styles.warning}>
            Al eliminar tu cuenta, perderás todos tus datos y publicaciones. Esta acción es irreversible.
        </p>
        <p className={styles.logout}>
            Si deseas cerrar sesión, puedes hacerlo <span onClick={handleLogout} className={styles.logoutLink}>aquí</span>.
        </p>
        <button onClick={onClose} className={styles.closeBtn}>Cerrar</button>
        
      </div>
    </div>
  );
};

export default UserSettings;
