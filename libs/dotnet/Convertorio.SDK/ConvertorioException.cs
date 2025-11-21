using System;

namespace Convertorio.SDK
{
    /// <summary>
    /// Exception thrown by Convertorio SDK operations
    /// </summary>
    public class ConvertorioException : Exception
    {
        /// <summary>
        /// Initialize a new ConvertorioException
        /// </summary>
        public ConvertorioException() : base()
        {
        }

        /// <summary>
        /// Initialize a new ConvertorioException with a message
        /// </summary>
        /// <param name="message">Error message</param>
        public ConvertorioException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initialize a new ConvertorioException with a message and inner exception
        /// </summary>
        /// <param name="message">Error message</param>
        /// <param name="innerException">Inner exception</param>
        public ConvertorioException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
