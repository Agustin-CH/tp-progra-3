case "$1" in
    start)
        mvn clean install -DskipTests && mvn spring-boot:run
        ;;
    stop)
        lsof -ti:8080 | xargs kill -9 2>/dev/null && echo "Detenido" || echo "No hay proceso"
        ;;
    restart)
        lsof -ti:8080 | xargs kill -9 2>/dev/null
        mvn clean install -DskipTests && mvn spring-boot:run
        ;;
    *)
        echo "Uso: ./app.sh [start|stop|restart]"
        exit 1
        ;;
esac

