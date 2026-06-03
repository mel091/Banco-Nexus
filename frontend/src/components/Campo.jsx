import styles from "../styles/styles";

export default function Campo({ label, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 16,
      }}
    >
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}