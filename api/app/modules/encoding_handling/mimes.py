try:
    import magic  # pip install python-magic
except ImportError:
    magic = None


class MimeGuesser:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.mime_guesser = None

            # Initialize the mime_guesser if magic module is available
            if magic:
                cls._instance.mime_guesser = magic.Magic(mime=True)

        return cls._instance

    def get_mime_guesser(self):
        """
        Returns the mime_guesser instance.
        """
        return self.mime_guesser

    @classmethod
    def guess_mime_type_from_file(cls, file_path):
        """
        Guesses the MIME type from the file path.

        Args:
            file_path (str): The path to the file.

        Returns:
            str: The guessed MIME type.
        """
        if not cls._instance.mime_guesser:
            raise ImportError(
                "magic module is not imported. Please install it with 'pip install python-magic'"
            )

        return cls._instance.mime_guesser.from_file(file_path)


def guess_mime_type_from_file(file_path):
    return MimeGuesser().guess_mime_type_from_file(str(file_path))
