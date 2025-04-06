package com.oneirogroup.digitask

import com.facebook.react.modules.network.CustomClientBuilder
import okhttp3.OkHttpClient
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.*

class UnsafeCustomClientBuilder : CustomClientBuilder {
  override fun apply(builder: OkHttpClient.Builder) {
    val trustAllCerts = arrayOf<TrustManager>(
      object : X509TrustManager {
        override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
        override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
        override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
      }
    )

    val sslContext = SSLContext.getInstance("SSL").apply {
      init(null, trustAllCerts, SecureRandom())
    }

    val sslSocketFactory = sslContext.socketFactory
    val trustManager = trustAllCerts[0] as X509TrustManager

    builder.sslSocketFactory(sslSocketFactory, trustManager)
    builder.hostnameVerifier { _, _ -> true }
  }
}
