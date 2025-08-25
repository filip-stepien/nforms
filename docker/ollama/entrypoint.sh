if [ -z "$OLLAMA_MODEL" ]; then
  OLLAMA_MODEL="gemma3:1b"
fi

ollama serve &

until ollama list >/dev/null 2>&1; do
    sleep 1
done

ollama pull "$OLLAMA_MODEL"

wait
